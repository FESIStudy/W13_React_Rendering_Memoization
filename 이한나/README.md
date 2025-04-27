
## 리액트 렌더링 최적화 포인트

### 1. React.memo

자식 컴포넌트를 React.memo로 감싸면, 부모 컴포넌트의 props가 변경되지 않았을 때 리렌더링을 건너 뛸 수 있음

```tsx
import { memo, useState } from 'react';

export default function MyApp() {
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

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

Greeting 컴포넌트는 name이 props 중 하나이기 때문에 name이 변경될 때마다 리렌더링되지만

memo를 사용하면 address는 props가 아니기 때문에 리렌더링 되지 않음.

### 2. useCallback과 useMemo

함수나 값을 캐싱해 리렌더링을 건너 뛸 수 있음.

메모된 자식 컴포넌트에 props로 함수를 전달 할 경우 useCallback을 사용해 메모이제이션해주어야 하고,

props로 객체를 전달 할 경우 useMemo를 사용해 메모이제이션 해주어야 함.

```tsx
function ProductPage({ productId, referrer, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} todos={visibleTodos}/>
    </div>
  );
```

```tsx
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit, todos }) {
  // ...
});
```

자식 컴포넌트가 React.memo로 감싸진 경우, 비원시타입 props 값들은 메모이제이션되어 있어야 렌더링 최적화가 가능하다.

- Object의 경우 : useMemo
- 콜백 함수의 경우 : useCallback

### 3. 리스트에 key 속성 사용

리스트 렌더링 시 각 요소를 고유하게 식별하기 위해 key를 사용한다.
리액트는 가상 DOM과 실제 DOM의 차이를 비교해 필요한 부분만 업데이트 하는데, 키는 이 비교 알고리즘 (diffing)의 중요한 기준이 되어 key가 없을 경우 모든 요소가 재렌더링되어 렌더링 성능 저하로 이어진다.

```tsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}

```

키의 규칙은 다음과 같다.

- 고유한 값
- 항목의 삽입 삭제에 따라 변경될 수 있는 배열의 인덱스 값은 안됨
- Math.random()과 같이 즉석 생성되는 key는 렌더링간 불일치로 안됨
- 데이터 기반의 안정적인 ID 값을 지향