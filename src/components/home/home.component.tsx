import React, { useState, useEffect, useRef, CSSProperties } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/store";
import { addToCart, removeFromCart } from "../../slicers/CartSlicer";
import { FakestoreContract } from "../../contracts/FakestoreContract";
import Loader from "../loader/loader.component";
export function HomeComponent() {
    const [categories, setCategories] = useState<string[]>([]);
    const [products, setProducts] = useState<FakestoreContract[]>([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems); // Access cartItems from the Redux store
    function LoadCategories() {
        setLoader(true);
        axios.get<string[]>("http://fakestoreapi.com/products/categories")
            .then((response) => {
                response.data.unshift("all");
                setCategories(response.data);
                setLoader(false);
            })
            .catch((error) => {
                console.log("Error loading categories:", error);
                setLoader(false);
            });
    }

    function LoadProducts(url: string) {
        setLoader(true);
        axios.get<FakestoreContract[]>(url)
            .then((response) => {
                setProducts(response.data);
                setLoader(false);
            })
            .catch((error) => {
                console.log("Error loading products:", error);
                setLoader(false);
            });
    }

    useEffect(() => {
        LoadCategories();
        LoadProducts("http://fakestoreapi.com/products");
    }, []);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === "all") {
            LoadProducts("http://fakestoreapi.com/products");
        } else {
            LoadProducts(`http://fakestoreapi.com/products/category/${event.target.value}`);
        }
    };

    const handleHomeClick = () => {
        LoadProducts("http://fakestoreapi.com/products");
    }

    function handleCategoryClick(category: string) {
        if (category === "all") {
            LoadProducts("http://fakestoreapi.com/products");
        } else {
            LoadProducts(`http://fakestoreapi.com/products/category/${category}`);
        }
    }

    const handleRemoveFromCart = (id: number) => {
        dispatch(removeFromCart({ id })); // Dispatch removeFromCart action with the item ID to be removed
    };

    const handleAddToCartClick = (product: FakestoreContract) => {
        dispatch(addToCart(product));
    };

    const handleCloseCartModal = () => {
        setIsCartModalOpen(false);
    };

    const buttonRef = useRef<HTMLButtonElement>(null);

    const getModalStyles = (): CSSProperties => {
        if (!buttonRef.current) return {};

        const rect = buttonRef.current.getBoundingClientRect();
        return {
            // position: 'absolute',
            // top: `${rect.bottom + window.scrollY}px`,
            // left: `${rect.left + window.scrollX}px`,
            display: isCartModalOpen ? 'block' : 'none',
            // zIndex: 1050,
        };
    };

    return (<>
        {loader && <Loader />}
        <div className="container-fluid">
            <header className="d-flex justify-content-between p-2 bg-dark text-white">
                <div><h2>Fakestore</h2></div>
                <div>
                    <span className="me-4"><button onClick={() => handleHomeClick()} className="btn text-white">HOME</button></span>
                    {categories.map(category => (
                        <span key={category} className="me-4"><button onClick={() => handleCategoryClick(category)} className="btn btn-sm text-white">{category.toUpperCase()}</button></span>
                    ))}
                </div>
                <div style={{ position: 'relative' }}>
                    <button ref={buttonRef} onClick={() => setIsCartModalOpen(true)} className="btn btn-light position-relative">
                        <span className="bi bi-cart me-3"></span>
                        <span className="badge rounded-circle bg-danger position-absolute">{cartItems.length}</span>
                    </button>
                    {isCartModalOpen && (
                        <div className="modal" style={getModalStyles()}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h2 className="text-primary">Your Cart Items</h2>
                                        <button onClick={handleCloseCartModal} className="btn-close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <ul className="list-group">
                                            {cartItems.map(item => (
                                                <li key={item.id} className="list-group-item list-group-item-action list-group-item-dark my-2">
                                                    <div className="d-flex col-12 align-items-center" style={{ height: '10vh' }} >
                                                        <div className="col-8">
                                                            {item.title} - ${item.price}
                                                        </div>
                                                        <div className="ms-auto">
                                                            <button onClick={() => handleRemoveFromCart(item.id)} className="btn btn-danger">Remove</button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header >
            <section className="mt-4 row">
                <nav className="col-lg-2 col-md-3">
                    <div>
                        <label className="form-label mb-2">Select Category</label>
                        <div>
                            <select onChange={handleCategoryChange} className="form-select">
                                {categories.map(category => (
                                    <option key={category} value={category}>{category.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </nav>
                <main className="col-lg-10 col-md-9 d-flex flex-wrap justify-content-around">
                    {products.map(product => (
                        <div className="col-xs-10 col-sm-5 col-md-3 col-lg-3 col-xl-2 ms-1 mt-4" style={{ minHeight: '70vh', height: '70vh' }}>
                            <div key={product.id} className="card p-2 h-100">
                                <img src={product.image} alt={product.title} height="150" className="card-img-top" />
                                <div className="card-header">
                                    <p className="card-title" title={product.title} style={{ textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} >{product.title}</p>
                                </div>
                                <div className="card-body">
                                    <dl>
                                        <dt>Price</dt>
                                        <dd>${product.price}</dd>
                                        <dt>Rating</dt>
                                        <dd><span className="bi bi-star-fill text-success"></span>{product.rating.rate} [{product.rating.count}]</dd>
                                    </dl>
                                </div>
                                <div className="card-footer">
                                    <button onClick={() => handleAddToCartClick(product)} className="btn btn-danger w-100">
                                        <span className="bi bi-cart4"></span>Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                    ))}
                </main>
            </section>
        </div >
    </>
    );
}
