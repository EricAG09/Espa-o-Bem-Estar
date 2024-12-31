import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Corrigido para usar "image"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name); // Corrigido para usar "name"
    data.append('description', formData.description); // Corrigido para usar "description"
    data.append('price', formData.price); // Corrigido para usar "price"
    data.append('image', formData.image); // Corrigido para usar "foto" conforme esperado no servidor

    try {
      await axios.post('http://localhost:5000/produtos', data);
      alert('Produto adicionado com sucesso!');
      console.log("Resposta do servidor: ",  Response.data)
    } catch (err) {
      console.error('Erro ao adicionar produto:', err.response?.data || err.message);
      alert('Erro ao adicionar produto.');
    }
  };

  // Criado para listar os produtos na pagina admin
  const [produtos, setProdutos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // listar os produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/produtos');
        setProdutos(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProdutos();
  }, []);

  // editar os produtos
  const handleEdit = (produtos) => {
    console.log("Produto selecionado para edição:", produtos);
    setSelectedProduct(produtos);
    setIsEditing(true);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!selectedProduct.name || !selectedProduct.description || !selectedProduct.price) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    try {
        const data = new FormData();

        // Adiciona os campos ao FormData
        if (selectedProduct.name) data.append("name", selectedProduct.name);
        if (selectedProduct.description) data.append("description", selectedProduct.description);
        if (selectedProduct.price) data.append("price", selectedProduct.price);

        // Adiciona a imagem apenas se ela foi alterada
        if (selectedProduct.image instanceof File) {
            data.append("image", selectedProduct.image);
        }

        const response = await axios.put(
            `http://localhost:5000/produtos/${selectedProduct._id}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        console.log("Produto atualizado com sucesso:", response.data);
        alert("Produto atualizado com sucesso!");
    } catch (error) {
        const errorMessage = error.response?.data || error.message || "Erro desconhecido";
        console.error("Erro ao atualizar produto:", errorMessage);
        alert(errorMessage);
    }
};


  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Adicionar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name" // Corrigido para "name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <textarea
          name="description" // Corrigido para "description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        ></textarea>
        <input
          type="number"
          name="price" // Corrigido para "price"
          placeholder="Preço"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="file"
          name="foto" // Corrigido para "foto" conforme esperado no servidor
          onChange={handleFileChange}
          className="w-full p-2 border"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          Adicionar
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4">
      {produtos.map((produtos, index) => (
        <div key={produtos.id || index} className="p-4 border rounded">
          <img src={produtos.image} alt={produtos.name} className="w-full h-48 object-cover" />
          <h2 className="text-xl font-bold">{produtos.name}</h2>
          <p>{produtos.description}</p>
          <p className="text-green-500 font-bold">${produtos.price}</p>
          <button
            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
            onClick={() => handleEdit(produtos)}
          >
            Editar
          </button>
        </div>
      ))}
    </div>

    {isEditing && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-4 rounded shadow-lg"
          >
            <h2 className="text-lg font-bold">Editar Produto</h2>
            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
              placeholder="Nome"
              className="block w-full border rounded p-2 mb-2"
            />
            <textarea
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
              placeholder="Descrição"
              className="block w-full border rounded p-2 mb-2"
            ></textarea>
            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
              placeholder="Preço"
              className="block w-full border rounded p-2 mb-2"
            />
            <input
              type="file"
              name="image" // Corrigido para "foto" conforme esperado no servidor
              onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })}
              className="w-full p-2 border"
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-1 px-3 rounded"
              onSubmit={handleUpdate}
            >
              Atualizar
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-1 px-3 rounded ml-2"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
