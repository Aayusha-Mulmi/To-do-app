// import { useEffect, useState } from "react";
// import { doc, updateDoc, arrayUnion, getDoc, arrayRemove   } from "firebase/firestore"; 
// import { db } from "../firebaseconfig"; 
// import { MdDelete } from "react-icons/md";
// import { AiFillEdit } from "react-icons/ai";
// import { message } from "antd"

// function Todolist() {
//   const [todo, setTodo] = useState("");
//   const [list, setList] = useState([]);
//   const documentId = "Today"; 

//   useEffect(()=>{
//     const fetchData = async()=>{
        
//         const docRef  = doc(db, "list" , "Today");
//         const docSnap = await getDoc(docRef);
        
//         if(docSnap.exists()){
//             const data = docSnap.data();
//             console.log("Document data:", docSnap.data());
//             setList(data.todo );
//           } else {
//               console.log("No such document!");
//           }
//       }
//       fetchData()
//   },[])

//   async function addList(event) {
//     event.preventDefault();
//     if (!todo.trim()) {
//         alert("Please enter a todo item.");
//         return;
//     }
//     const write = doc(db, "list", documentId);
//     try {

//         await updateDoc(write, {
//             todo: arrayUnion(todo), 
//         });
//         console.log("Todo updated in Firestore!");
//         setList((prevList) => [...prevList, todo]); 
//         message.success(" List Added successfully !")
//         setTodo(""); 
//     } catch (error) {
//       console.error("Error updating todo in Firestore:", error);
//     }
//   }

//   async function deleteItem(itemToDelete) {
//     const deltodo = doc(db, "list", documentId);

//     try {
//       await updateDoc(deltodo, {
//         todo: arrayRemove(itemToDelete) 
//       });
//       console.log("Item deleted from Firestore!"); 
//       setList((prevList) => prevList.filter(item => item !== itemToDelete));
//       message.success(" List Deleted successfully !")
//     } catch (error) {
//       console.error("Error deleting item from Firestore:", error);
//     }
//   }

//   async function handleEdit(itemToEdit) {
//     const edittodo = doc(db, "list", "Today");

//     try{
//       await updateDoc ( edittodo,{
//         todo: arrayUnion(itemToEdit)
//       });
//       console.log("Items edited!"); 
//       setList((prevList) => prevList.filter(item => item !== itemToEdit));
//     }
//     catch(error){
//         console.error("Error editing item", error)
//     }
    
//   }

//   return (
//     <div>
//       <div className="flex justify-center">
//         <p className="text-[3rem] font-sans">To do list</p>
//       </div>

//       <form className="flex justify-center mt-7">
//         <div className="flex">
//           <input
//             type="text"
//             placeholder="Enter today's list"
//             className="border-4 border-gray rounded-md p-4 w-[30rem]"
//             onChange={(e) => setTodo(e.target.value)}
//             value={todo}
//           />
//           <button
//             className="hover:bg-green-700  bg-green-200 border-green-700 border-2 w-[5rem] h-[3rem] rounded-xl p-2 ml-[1rem] hover:text-white"
//             onClick={addList}
//           >
//             Save
//           </button>
//         </div>
//       </form>

//       <div className="flex justify-center mt-9 mr-[6rem]">
//       <ul>
//           {list.map((item, index) => (
//             <div key={index} className="flex items-center justify-between w-[32rem] border-gray-400 border-2 mt-3 p-4 rounded-md">
//               <li className="w-[28rem]">{item}</li>
//               <MdDelete
//                 className="cursor-pointer text-red-500 hover:bg-slate-300 hover:rounded-full "
//                 onClick={() => deleteItem(item)}
//               />
//               <AiFillEdit 
//               className="cursor-pointer text-green-800 hover:bg-slate-300 hover:rounded-full ml-[1rem] "
//               onClick={()=>handleEdit(item)}/>
//             </div>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Todolist;
import { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"; 
import { db } from "../firebaseconfig"; 
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { message } from "antd";

function Todolist() {
  const [todo, setTodo] = useState("");
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // New state for tracking the item being edited
  const [newTodo, setNewTodo] = useState(""); // New state for storing the updated item value
  const documentId = "Today"; 

  // Fetching data from Firestore on component mount
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

  // Add item to Firestore and update local state
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

  // Delete item from Firestore and update local state
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

  // Enter edit mode and set the current item in the input
  function openEditMode(item) {
    setEditingItem(item);
    setNewTodo(item); // Pre-fill the input with the current item value
  }

  // Edit the item in Firestore and update local state
  async function handleEdit() {
    if (!newTodo.trim()) {
      alert("Please enter a valid todo item.");
      return;
    }

    const edittodo = doc(db, "list", documentId);

    try {
      // First, remove the old item
      await updateDoc(edittodo, {
        todo: arrayRemove(editingItem),
      });

      // Then, add the updated item
      await updateDoc(edittodo, {
        todo: arrayUnion(newTodo),
      });

      // Update local state
      setList((prevList) =>
        prevList.map((item) => (item === editingItem ? newTodo : item))
      );
      message.success("Item edited successfully!");
      setEditingItem(null); // Exit edit mode
      setNewTodo(""); // Clear input field
    } catch (error) {
      console.error("Error editing item:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-center">
        <p className="text-[3rem] font-sans">To do list</p>
      </div>

      <form className="flex justify-center mt-7">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter today's list"
            className="border-4 border-gray rounded-md p-4 w-[30rem]"
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />
          <button
            className="hover:bg-green-700 bg-green-200 border-green-700 border-2 w-[5rem] h-[3rem] rounded-xl p-2 ml-[1rem] hover:text-white"
            onClick={addList}
          >
            Save
          </button>
        </div>
      </form>

      <div className="flex justify-center mt-9 mr-[6rem]">
        <ul>
          {list.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-[32rem] border-gray-400 border-2 mt-3 p-4 rounded-md"
            >
              {editingItem === item ? (
                // Show input field when editing mode is active for this item
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="border-4 border-gray rounded-md p-2 w-[28rem]"
                />
              ) : (
                // Show list item text if not in editing mode
                <li className="w-[28rem]">{item}</li>
              )}

              {editingItem === item ? (
                // Show save button when editing
                <button
                  className="ml-2 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  onClick={handleEdit}
                >
                  Save
                </button>
              ) : (
                // Show edit and delete icons when not editing
                <>
                  <AiFillEdit
                    className="cursor-pointer text-green-800 hover:bg-slate-300 hover:rounded-full ml-[1rem]"
                    onClick={() => openEditMode(item)}
                  />
                  <MdDelete
                    className="cursor-pointer text-red-500 hover:bg-slate-300 hover:rounded-full ml-[1rem]"
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
