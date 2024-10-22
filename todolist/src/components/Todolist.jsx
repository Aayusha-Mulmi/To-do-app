import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"; 
import { db } from "../firebaseconfig"; 
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { message } from "antd";

function Todolist() {
  const [todo, setTodo] = useState("");
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newTodo, setNewTodo] = useState("");
  const documentId = "Today"; 

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "list", documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setList(data.todo);
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, []);

  async function addList(event) {
    event.preventDefault();
    if (!todo.trim()) {
      alert("Please enter a todo item.");
      return;
    }
    
    const write = doc(db, "list", documentId);
    try {
      await updateDoc(write, {
        todo: arrayUnion(todo),
      });
      setList((prevList) => [...prevList, todo]);
      message.success("List Added successfully!");
      setTodo("");
    } catch (error) {
      console.error("Error updating todo in Firestore:", error);
    }
  }

  async function deleteItem(itemToDelete) {
    const deltodo = doc(db, "list", documentId);
    
    try {
      await updateDoc(deltodo, {
        todo: arrayRemove(itemToDelete),
      });
      setList((prevList) => prevList.filter((item) => item !== itemToDelete));
      message.success("List Deleted successfully!");
    } catch (error) {
      console.error("Error deleting item from Firestore:", error);
    }
  }

  function openEditMode(item) {
    setEditingItem(item);
    setNewTodo(item);
  }

  async function handleEdit() {
    if (!newTodo.trim()) {
      alert("Please enter a valid todo item.");
      return;
    }

    const edittodo = doc(db, "list", documentId);

    try {
      await updateDoc(edittodo, {
        todo: arrayRemove(editingItem),
      });
      await updateDoc(edittodo, {
        todo: arrayUnion(newTodo),
      });
      setList((prevList) =>
        prevList.map((item) => (item === editingItem ? newTodo : item))
      );
      message.success("Item edited successfully!");
      setEditingItem(null);
      setNewTodo("");
    } catch (error) {
      console.error("Error editing item:", error);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        <p className="text-3xl font-sans">To do list</p>
      </div>

      <form className="flex justify-center mt-7">
        <div className="flex flex-col md:flex-row items-stretch w-full">
          <input
            type="text"
            placeholder="Enter today's list"
            className="border-4 border-gray rounded-md p-4 flex-1"
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />
          <button
            className="hover:bg-green-700 bg-green-200 border-green-700 border-2 w-full md:w-[5rem] h-[3rem] rounded-xl p-2 mt-2 md:mt-0 md:ml-2"
            onClick={addList}
          >
            Save
          </button>
        </div>
      </form>

      <div className="flex justify-center mt-9">
        <ul className="w-full">
          {list.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full border-gray-400 border-2 mt-3 p-4 rounded-md"
            >
              {editingItem === item ? (
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="border-4 border-gray rounded-md p-2 flex-1"
                />
              ) : (
                <li className="flex-1">{item}</li>
              )}

              {editingItem === item ? (
                <button
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  onClick={handleEdit}
                >
                  Save
                </button>
              ) : (
                <>
                  <AiFillEdit
                    className="cursor-pointer text-green-800 hover:bg-slate-300 hover:rounded-full ml-2"
                    onClick={() => openEditMode(item)}
                  />
                  <MdDelete
                    className="cursor-pointer text-red-500 hover:bg-slate-300 hover:rounded-full ml-2"
                    onClick={() => deleteItem(item)}
                  />
                </>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todolist;
