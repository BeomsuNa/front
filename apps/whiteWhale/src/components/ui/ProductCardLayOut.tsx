import { Product } from '@/lib/utils';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ProductProps {
  product: Product;
}

const ProductCardLayOut: React.FC<ProductProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit/${product.id}`);
  };

  return (
    <Link to={`/edit/${product.id}`}>
      <article className="w-full h-auto grid grid-cols-3 gap-5 border border-black mb-5 items-center">
        <figure>
          <img
            src={product.imageLink}
            alt={product.productName}
            className="w-64 h-64 p-5 object-cover"
          />
          <figcaption className="sr-only">{product.productName}</figcaption>
        </figure>
        <header className="flex flex-col items-start ml-24">
          <div>제목 : {product.productName}</div>
          <div>설명 :{product.description}</div>
          <div>가격 : {product.price}</div>
        </header>
        {/* <div>수량 : {product.quantity}</div> */}
      </article>
    </Link>
  );
};

export default ProductCardLayOut;
