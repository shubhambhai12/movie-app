import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactStars from "react-stars";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { moviesRef } from "../firebase/firebase";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const Cards = ({ searchQuery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _data = await getDocs(moviesRef);
      _data.forEach((doc) => {
        setData((prv) => [...prv, { ...doc.data(), id: doc.id }]);
      });
      setLoading(false);
    }
    getData();
  }, []);

  const deleteCard = async (id) => {
    try {
      await deleteDoc(doc(moviesRef, id));
      setData(data.filter((item) => item.id !== id));
      Swal.fire("Deleted!", "The card has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting document: ", error);
      Swal.fire("Error!", "There was an error deleting the card.", "error");
    }
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCard(id);
      }
    });
  };

  const filteredData = data.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-wrap justify-between px-3 mt-2">
      {loading ? (
        <div className="w-full flex justify-center items-center h-96">
          <ThreeDots height={40} color="white" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="w-full flex justify-center items-center h-96">
          <h1 className="text-white text-2xl">No cards found</h1>
        </div>
      ) : (
        filteredData.map((e, i) => {
          return (
            <Link to={`/detail/${e.id}`} key={i}>
              <div className="card font-medium shadow-lg p-2 hover:-translate-y-3 cursor-pointer mt-6 transition-all duration-500">
                <img className="h-60 md:h-72" src={e.image} alt={e.title} />
                <h1>{e.title}</h1>
                <h1 className="flex items-center">
                  <span className="text-gray-500 mr-1">Rating:</span>
                  <ReactStars
                    size={20}
                    half={true}
                    value={e.rating / e.rated}
                    edit={false}
                  />
                </h1>
                <h1>
                  <span className="text-gray-500">Year:</span> {e.year}
                </h1>
                <div className="text-end">
                  <DeleteIcon onClick={(event) => handleDeleteClick(e.id, event)} />
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Cards;
