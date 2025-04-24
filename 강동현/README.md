# 리액트 리렌더링 최적화
## memo
컴포넌트 메모이제이션 함수
- 이전 props와 새 props를 비교해서 **props가 변경되지 않으면** 컴포넌트를 실행하지 않으며 렌더링 **결과(Fiber NODE)를 재사용** 또는 **렌더링 스킵**

```js
import { memo, useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

// memoization
const Greeting = memo(function Greeting({ name } : { name: string }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```
![alt text](image-1.png)
1. n번째의 commit
2. 첫번째 커밋의 렌더링 속도 0.9ms
- App은 0.9ms 중 0.5ms
- Greeting은 0.4ms중 0.3ms

![alt text](image.png)
1. 메모이제이션 컴포넌트의 커밋 부분
2. Greeting 컴포넌트가 메모이제이션되어 렌더링 스킵되며 0.5ms 소요됨

## useCallback
함수 메모이제이션 함수
- 리렌더링될 때마다 함수는 새로 만들어지는데, **같은 함수 인스턴스**를 유지하고 싶을 때 사용합니다.
```js
function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');

  const onLogging = useCallback(() => {
    console.log(count);
  }, [count]); // count가 바뀔 때만 새로 생성됨

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Count: {count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>increment</button>
      </div>
      <MyButton onClick={onLogging} />
    </>
  );
}

const MyButton = memo(({ onClick }: { onClick: () => void }) => {
  console.log('button rendered');
  return <button onClick={onClick}>Logging</button>;
});
```
- App이 리렌더링이 일어나더라도 onLogging 함수의 인스턴스는 유지
- onLogging은 count에 의해서만 재생성 됨
- 빈배열을 사용할 시 함수의 인스턴스는 계속 유지
- useCallback을 **사용하지 않는 경우** memo를 하더라도 **onClick이 재생성되어 MyButton이 리렌더링 발생**

📌 주로 자식 컴포넌트에 함수를 props로 넘길 때 memo와 함께 사용합니다

## useMemo
계산 결과 메모이제이션 함수
- 비싼 계산(무거운 연산, 반복문 등)을 다시 하지 않고, 이전 값을 재사용하기 위해 사용합니다
- 리렌더링될 때마다 계산이 반복되는 걸 방지합니다
```js
export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  //List 컴포넌트는 메모이제이션 된 상태
  //const List = memo(function List...)
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```
- props 중 theme만 변경된 경우 **visiableTodos 재사용**
- visiableTodos를 props으로 받는 List는 렌더링 스킵

## key
React에서 리스트 렌더링할 때 각 항목을 구분하기 위한 고유 식별자
- key는 **변경 감지(diffing 알고리즘)**에 사용됨
- 잘못된 key (ex. index 사용)는 불필요한 리렌더링이나 렌더 순서 문제를 유발할 수 있음
```jsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

## react compiler
- useMemo, useCallback, memo 등 컴파일러가 자동으로 메모이제이션을 해줌

### 메모이제이션 하는것
1. 컴포넌트의 연쇄적인 리렌더링 건너뛰기
- `<Parent />`를 리렌더링 한 경우 `<Parent />`컴포넌트 트리내 여러 컴포넌트가 리렌더링된 경우
2. 외부에서 비용이 많이 드는 계산 건너뛰기



### React compiler를 사용했을 때 비교
사용 전
```js
function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');

  const onLogging = useCallback(() => {
    console.log(count);
  }, [count]); // count가 바뀔 때만 새로 생성됨

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Count: {count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>increment</button>
      </div>
      <MyButton onClick={onLogging} />
    </>
  );
}

const MyButton = memo(({ onClick }: { onClick: () => void }) => {
  console.log('button rendered');
  return <button onClick={onClick}>Logging</button>;
});
```

![alt text](image-2.png)
- React.memo를 한 곳에 memo 표시

사용 후
```js
function App() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');
  
  const onLogging = () => {
    console.log(count);
  }

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Count: {count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>increment</button>
      </div>
      <MyButton onClick={onLogging} />
    </>
  );
}

const MyButton = ({ onClick }: { onClick: () => void }) => {
  console.log('button rendered');
  return <button onClick={onClick}>useCallback</button>;
};
```

![alt text](image-4.png)
- 컴파일러가 컴포넌트를 자동 최적화

## 정리
|이름|설명|
|-|-|
|memo|props가 바뀌지 않으면 컴포넌트 리렌더링 방지|
|useCallback|함수를 메모이제이션해 불필요한 자식 컴포넌트 리렌더링 방지|
|useMemo|	계산 비용이 큰 값을 메모이제이션해 성능 최적화|
|Key|key가 고유하지 않을 경우 리렌더링이나 렌더 순서에 문제발생|
|compiler|컴파일러가 자동으로 컴포넌트 최적화 작업|

