// ProductComponent.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductComponent.css';
import Loader from "../loader/loader.component";
import { addToCart } from "../../slicers/CartSlicer";
import { FakestoreContract } from "../../contracts/FakestoreContract";
import { useDispatch } from "react-redux";

export function ProductComponent() {
    const [product, setProduct] = useState<FakestoreContract>({
        description: '',
        id: 0,
        image: '',
        price: 0,
        title: '',
        quantity: 0,
        rating: { rate: 0, count: 0 }
    });
    const [loading, setLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://fakestoreapi.com/products/${id}`)
            .then((response) => {
                response.data.quantity = 1;
                setProduct(response.data);
                setLoading(false);
                console.log(response.data);
            }).catch((error) => {
                console.error(error);
            });


    }, [id]);

    const handleAddToCartClick = (product: FakestoreContract) => {
        dispatch(addToCart(product));
        navigate('/');
    };

    const handleQuantityChange = (e: any) => {
        if (e.target.value < 0) return;
        setProduct(prevState => {
            return {
                ...prevState,
                quantity: e.target.value
            }
        })
    }

    const renderStars = (rate: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rate) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
            } else if (i === Math.ceil(rate) && !Number.isInteger(rate)) {
                stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-warning"></i>);
            }
        }
        return stars;
    };

    if (loading) return (<Loader />);

    return (
        <div className="container-fluid">
            <h2 className="text-secondry">{product.title}</h2>
            <div className="container d-flex mt-4 p-4">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-6">
                            <img src={product.image}
                                className="img-fluid rounded-start " alt={product.image} height='300' width='300' />
                        </div>
                        <div className="col-md-6">
                            <div className="card-body">
                                <h5 className="card-title">{product.title}
                                </h5>
                                <p className="card-text">
                                    {product.description}
                                </p>
                                <p className="card-text">
                                    <b>Price $</b>
                                    {product.price}
                                </p>
                                <p className="card-text">
                                    <b>Rating</b>{renderStars(product.rating.rate)}<small> ({product.rating.count})</small>
                                </p>
                                <div className="p-1">Quantity <input type="number" value={product.quantity} min="1" onChange={handleQuantityChange} /></div>
                                <div className="card-text">
                                    <Link to='/' className="btn btn-primary">Back</Link>
                                    <button className="btn btn-danger" onClick={() => handleAddToCartClick(product)}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
