import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

//local storage
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState(''); // user input
  const [list, setList] = useState(getLocalStorage()); //list array 
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' }); // alert bool
  const [isEditing, setIsEditing] = useState(false); // state of editing
  const [editID, setEditID] = useState(null); //item id for editing
  
  const showAlert = (show = false, type = '', msg = '') => { //default
    setAlert({ show, type, msg });
  };
  const clearList = () => { //clear
    showAlert(true, 'removed', 'List emptied');
    setList([]);
  };
  const editItem = (id) => { //edit
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  const removeItem = (id) => { //remove
    showAlert(true, 'error', 'Item removed');
    setList(list.filter((item) => item.id !== id));
  };
  
  //onchange ->
  const handleSubmit = (e) => {
    e.preventDefault(); console.log('success!');
    // if no input
    if (!name) {
      showAlert(true, 'error', 'please enter value'); //alert
    } 
    else if (name && isEditing) { // edit chosen grocery
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Item value changed'); //alert
    } 
    else {   // adding on list
      showAlert(true, 'success', 'Item added to the list'); //alert
      const newItem = { id: new Date().toISOString (), title: name };

      setList([...list, newItem]);
      setName('');
      setIsEditing(false);
    }
  };

  // local storage  
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>grocery bud</h3>
        <div className='form'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {/* //conditional rendering */}
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            clear all items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;