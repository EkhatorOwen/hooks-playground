import React, { useReducer, useContext, useEffect, useRef } from "react";
import "./App.css";

function appReducer(state, action) {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "add":
      return [
        ...state,
        {
          id: Date.now(),
          text: "",
          completed: false
        }
      ];
    case "delete":
      return state.filter(item => item.id !== action.payload);
    case "completed":
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed
          };
        }
        return item;
      });

    default:
      return state;
  }
}

const Context = React.createContext();

function useEffectOnce(cb) {
  const didRun = useRef(false)
  
  useEffect(
    () => {
      if(!didRun.current){
        cb()
        
        didRun.current=true;
      }
  })

}

function TodoApp() {
  const [state, dispatch] = useReducer(appReducer, []);

  //didRun is an object with property of current which is immutable

  useEffectOnce(()=>{
    const raw = localStorage.getItem("data")
    dispatch({ type: "reset", payload: JSON.parse(raw) })
  })

  useEffect(
    () => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={dispatch}>
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
        className="App"
      >
        <h1> Todos App </h1>
        <button
          style={{
            marginBottom: "10px"
          }}
          onClick={() =>
            dispatch({
              type: "add"
            })
          }
        >
          New Todo
        </button>{" "}
        <TodosList items={state} />
      </div>
    </Context.Provider>
  );
}

function TodosList({ items }) {
  return items.map(item => <TodoItem key={item.id} id={item.id} {...item} />);
}

function TodoItem({ id, text, completed }) {
  const dispatch = useContext(Context);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "10px"
      }}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() =>
          dispatch({
            type: "completed",
            payload: id
          })
        }
      />{" "}
      <input type="text" defaultValue={text} />{" "}
      <button
        onClick={() =>
          dispatch({
            type: "delete",
            payload: id
          })
        }
      >
        Delete{" "}
      </button>{" "}
    </div>
  );
}

export default TodoApp;
