import {
  Ref, nextTick, ref, watch, UnwrapRef, computed, isRef,
} from 'vue';

type IMinimalTask<T> = {
  startFunc?: (val: T) => boolean, // 任务开始的标志，默认当ref为true的时候开始任务
  endFunc?: (val: T) => boolean, // 任务结束的标志，默认当ref值变为false、null、undefined结束任务
  val: T,
  no: number,
  timeout?: number,
}

type ITask<T> = {
  watchRef: Ref<UnwrapRef<T>>, // 任务监听的ref值
  nextRef: Ref<UnwrapRef<T>>, // 任务返回的ref值
  startFunc?: (val: UnwrapRef<T>) => boolean, // 任务开始的标志，默认当ref为true的时候开始任务
  endFunc?: (val: UnwrapRef<T>) => boolean, // 任务结束的标志，默认当ref值变为false、null、undefined结束任务
  no: number, // 任务优先级
  status: Ref<'before' | 'start' | 'end'>,
  nextTask?: ITask<T> | null,
  timeout?: number,
}

export function createTaskContainer() {
  // const tasks: Array<ITask> = [];
  let curTask: ITask<any> | null | undefined = null;
  let isStarting = false;

  function executeTask() {
    isStarting = true;
    if (curTask?.status.value === 'end') {
      curTask = curTask.nextTask;
      executeTask();
    } else if (curTask?.status.value === 'start') {
      curTask.nextRef.value = curTask.watchRef.value;
      const stop = watch(curTask.watchRef, (newVal) => {
        if (curTask) {
          curTask.nextRef.value = curTask.watchRef.value;
          if (curTask.endFunc && curTask.endFunc(newVal)) {
            curTask.status.value = 'end';
            curTask = curTask.nextTask;
            stop();
            executeTask();
          }
        }
      });
    } else if (curTask) {
      let timeout:number = 0;
      const tempTask = curTask;
      const stopWatchEvent = watch(tempTask.status, (newVal) => {
        if (newVal !== 'before') {
          if (timeout) {
            clearTimeout(timeout);
          }
          stopWatchEvent();
          executeTask();
        }
      })
      // 如果当前任务状态为未开始，则等待预定的超时时间，如果还没有开始，则跳过当前任务。
      timeout = setTimeout(() => {
        if (tempTask?.status.value === 'before') {
          stopWatchEvent();
          curTask = tempTask.nextTask;
          executeTask();
        }
        timeout = 0;
      }, curTask.timeout || 100);
    } else {
      isStarting = false;
    }
  }

  function taskRef<K>(task: IMinimalTask<K>): Ref<UnwrapRef<K>> {
    const watchRef = ref(task.val);
    const nextRef = ref(task.val);
    const realTask: ITask<K> = {
      watchRef,
      nextRef,
      no: task.no,
      status: ref('before'),
      timeout: task.timeout
    };
    if (!task.startFunc) {
      realTask.startFunc = (newVal) => !!newVal;
    }
    if (!task.endFunc) {
      realTask.endFunc = (newVal) => !newVal;
    }
    watch(realTask.watchRef, () => {
      if (realTask.startFunc && realTask.startFunc(realTask.watchRef.value)) {
        realTask.status.value = 'start';
        if (!isStarting) {
          curTask = realTask;
          executeTask();
        }
      } else if (realTask.endFunc && realTask.endFunc(realTask.watchRef.value)) {
        realTask.status.value = 'end';
      }
    });

    // 根据task的no属性，插入到指定位置
    if (!curTask) {
      curTask = realTask;
    } else {
      let tempTask: typeof curTask.nextTask = curTask.nextTask;
      let prev: typeof curTask = curTask;

      // just one task
      if (!tempTask) {
        if (realTask.no < prev.no) {
          realTask.nextTask = prev;
          curTask = realTask;
        } else {
          prev.nextTask = realTask;
        }
      }

      while (tempTask) {
        if (prev.no < realTask.no && tempTask.no > realTask.no) {
          prev.nextTask = realTask;
          realTask.nextTask = tempTask;
          break;
        } else if (!tempTask.nextTask) {
          // 如果最后一个节点也没有满足条件，则新增的任务放到末尾
          tempTask.nextTask = realTask;
          break;
        }
        prev = tempTask;
        tempTask = tempTask.nextTask;
      }
    }

    const taskRef = computed({
      get: () => nextRef.value,
      set: (value) => {
        watchRef.value = value;
      },
    });

    return taskRef;
  }

  const container = {
    taskRef,
  };

  nextTick(() => {
    executeTask();
  });

  return container;
}

const taskContainer = createTaskContainer();

export default taskContainer;
