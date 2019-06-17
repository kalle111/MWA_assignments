import React, {useState, useEffect} from 'react';


function App()
{
  const [counter, setCounter] = useState(1);
  const [name, setName] = useState('Matias');
  const [books, setBooks] = useState([{id:2, title: "My book"}]);

  useEffect(() => {
    console.log("In useEffect, counter:" + counter + ", name=" + name);
  }, [counter]);

  return (
    <div>
      <p>Counter is {counter}</p>
      <p>Counter is {name}</p>
      <ul>
        {books.map( (book, index) => <li key={index}>{book.id}, {book.title}</li>)}
      </ul>

      <button onClick={() => setCounter(counter+1)}>Add counter</button>
      <button onClick={() => setName(name + counter)}>Change name</button>
      <button onClick={() => setBooks([...books, {id:counter, title: "New book"}])}>Add a new book</button>
    </div>
  );
}
export default App;