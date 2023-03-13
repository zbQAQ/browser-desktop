import { v4 as uuid } from 'uuid';

const TODO_LIST_KEY = 'Z:TODO_LIST';

interface ITodoListItem {
  id: string;
  status: number; // status 0: 无状态  1：complete已完成
  title: string;
  createTime: number;
}

export function getTodoList() {
  return new Promise<{ status: number; data: ITodoListItem[] }>((resolve) => {
    const dataString = localStorage.getItem(TODO_LIST_KEY);
    resolve({
      status: 200,
      data: dataString ? JSON.parse(dataString) : [],
    });
  });
}

export async function addTotoList(title: string) {
  const { data } = await getTodoList();
  return new Promise((resolve) => {
    localStorage.setItem(
      TODO_LIST_KEY,
      JSON.stringify(
        data.concat({ id: uuid(), title, status: 0, createTime: Date.now() })
      )
    );
    resolve({ status: 200, flag: true });
  });
}

export async function deleteTodoList(id: string) {
  const { data } = await getTodoList();
  return new Promise((resolve) => {
    localStorage.setItem(
      TODO_LIST_KEY,
      JSON.stringify(data.filter((item: any) => item.id !== id))
    );
    resolve({ status: 200, flag: true });
  });
}

export async function updateTodoStatus(id: string, status: boolean) {
  const { data } = await getTodoList();
  return new Promise((resolve) => {
    const newList = data.map((item: any) => {
      if (item.id === id) {
        item.status = status ? 1 : 0;
      }
      return item;
    });
    localStorage.setItem(TODO_LIST_KEY, JSON.stringify(newList));
    resolve({ status: 200, flag: true });
  });
}
