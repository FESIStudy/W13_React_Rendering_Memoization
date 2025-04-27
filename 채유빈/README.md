### Memoization

- 함수 호출의 결과를 캐싱하고, 동일한 입력이 다시 발생할 때 캐싱된 결과를 반환하는 프로그래밍 기술
- 동일한 입력으로 여러 번 호출되는 함수 또는 컴포넌트가 있을 때 React에서 유용하다.

<br/>

### useMemo

- 메모이제이션된 **값**을 반환하는 리액트 훅
    
    ```jsx
    const memoizedValue = useMemo(calculateValue, dependencies)
    ```
    
- 의존성이 변경되지 않는 한 결과값 또한 다시 계산하지 않는다.
- 비용이 높은 로직의 재계산 생략, 컴포넌트 리렌더링 방지 등에 사용한다.
> ⚠️
> 값을 재활용하기 위해 따로 메모리를 사용하기 때문에 불필요한 값까지 메모이제이션하면 오히려 메모리를 낭비할 수 있다. 연산이 복잡하지 않을 때도 사용하는 것은 오히려 코드의 복잡도를 높이고 유지보수를 어렵게 할 수 있다.

<br/>

### useCallback

- 메모이제이션된 **콜백 함수**를 반환하는 리액트 훅
    
    ```tsx
    import { useCallback } from 'react';
    
    export default function ProductPage({ productId, referrer, theme }) {
      const handleSubmit = useCallback((orderDetails) => {
        post('/product/' + productId + '/buy', {
          referrer,
          orderDetails,
        });
      }, [productId, referrer]);
    ```
    
- useCallback 구현에는 useMemo가 사용되며, `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`와 같다.
- 함수를 메모리에 저장하고, 의존성 배열에 명시된 변수들의 값이 변경될 때만 함수를 새로 생성한다. 이를 통해 컴포넌트가 리렌더링되더라도 동일한 함수 참조를 유지할 수 있다.
- 불필요한 렌더링을 방지하기 위해 참조의 동일성을 보장하거나, 자식 컴포넌트에 의존적인 콜백 함수를 전달할 때 유용하다.

<br/>

### memo

- **컴포넌트**를 메모이제이션하는 고차 컴포넌트
    
    ```tsx
    const MemoizedComponent = React.memo(function MyComponent(props) {
      /* 컴포넌트 구현 */
    });
    ```
    
- props가 변경되지 않는 한 컴포넌트를 리렌더링하지 않는다.
- 부모 컴포넌트의 상태 변경에 따라 자식 컴포넌트가 불필요하게 렌더링되는 경우, 렌더링 최적화가 필요한 대규모 리스트나 테이블에서 유용하다.

<br/>

### React Compiler

- 업데이트 성능 개선(기존 컴포넌트의 리렌더링)을 목적으로 하는 컴파일러
    - 자바스크립트와 React 규칙에 대한 지식을 활용하여 자동으로 컴포넌트와 훅 내부의 값 또는 값 그룹을 메모이제이션한다.
- **리렌더링 최적화**
    - React Compilers는 상태 변경 시 앱에서 관련된 부분만 리렌더링되도록 **수동 메모이제이션과 동등한 기능을 자동으로 적용**한다. (Fine-Grained Reactivity)
- **비용이 많이 드는 계산 메모이제이션**
> ⚠️
> React 컴파일러는 React 컴포넌트와 훅만 메모이제이션하며, 모든 함수를 메모이제이션하는 것은 아니다.

- 컴파일러 적용 후 React Devtools의 `components` 탭에서 다음과 같이 메모이제이션 되었음을 확인할 수 있다.
    ![image](https://github.com/user-attachments/assets/2bfa976e-a4fc-4524-b729-07c4e392979a)

- `use no memo`
    - React 컴파일러에 의해 컴파일되지 않도록 컴포넌트와 훅을 선택적으로 제외할 수 있는 지시어(임시방편이므로 필요한 경우가 아니면 사용을 권장하지 않는다.)
