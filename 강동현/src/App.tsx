import { useState } from 'react';

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

export default App;
