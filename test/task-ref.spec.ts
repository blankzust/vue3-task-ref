import { defaultTaskContainer, createTaskContainer } from '../src/index';
import { nextTick, watch } from 'vue';

test('test task-ref in creament order', async () => {
  const { taskRef } = defaultTaskContainer;
  const task1Ref = taskRef({
    val: false,
    no: 1,
  });

  const task2Ref = taskRef({
      val: false,
      no: 2
  });

  task1Ref.value = true
  task2Ref.value = true;

  nextTick(() => {
    expect(task1Ref.value).toBe(true);
    expect(task2Ref.value).toBe(false);
    task1Ref.value = false;
    nextTick(() => {
      expect(task2Ref.value).toBe(true);
      task2Ref.value = false;
    })
  })
})

test('test task-ref in decrease order', async () => {
  const { taskRef } = createTaskContainer();
  const task1Ref = taskRef({
    val: false,
    no: 3,
  });

  const task2Ref = taskRef({
      val: false,
      no: 1
  });
  const task3Ref = taskRef({
    val: false,
    no: 2
  });

  task1Ref.value = true
  task2Ref.value = true;
  task3Ref.value = true;

  nextTick(() => {
    expect(task1Ref.value).toBe(false);
    expect(task3Ref.value).toBe(false);
    expect(task2Ref.value).toBe(true);
    task2Ref.value = false;
    nextTick(() => {
      expect(task3Ref.value).toBe(true);
      expect(task1Ref.value).toBe(false);
      task3Ref.value = false;
      nextTick(() => {
        expect(task1Ref.value).toBe(true);
        task1Ref.value = false;
        nextTick(() => {
          // 全部任务完成后，单独开始一个任务
          task2Ref.value = true;
          nextTick(() => {
            expect(task2Ref.value).toBe(true);
            task2Ref.value = false;
          })
        })
      })
    })
  })
})

test('test task-ref when timeout', async () => {
  jest.useFakeTimers();
  const { taskRef } = createTaskContainer();
  const task1Ref = taskRef({
    val: false,
    no: 1,
  });

  const task2Ref = taskRef({
      val: false,
      no: 2,
      timeout: 500,
  });

  const task3Ref = taskRef({
    val: false,
    no: 3
  });

  task1Ref.value = true
  task3Ref.value = true;

  jest.clearAllTimers();

  nextTick(() => {
    expect(task1Ref.value).toBe(true);
    expect(task2Ref.value).toBe(false);
    expect(task3Ref.value).toBe(false);
    task1Ref.value = false;

    nextTick(() => {
      expect(task1Ref.value).toBe(false);
      expect(task2Ref.value).toBe(false);
      expect(task3Ref.value).toBe(false);
      // 模拟600ms过去了，task2Ref任务过期
      jest.advanceTimersByTime(1200);
      nextTick(() => {
        // 验证超时
        expect(task1Ref.value).toBe(false);
        expect(task2Ref.value).toBe(false);
        expect(task3Ref.value).toBe(true);
      })
    })
  })
})

// test("setTimeout test", () => {
//   jest.useFakeTimers();
//   const mockFn = jest.fn();
//   setTimeout(mockFn, 1000);
//   jest.advanceTimersByTime(500);
//   expect(mockFn).toHaveBeenCalled();
// });
