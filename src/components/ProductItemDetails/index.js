import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'


import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS'
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',

}


class ProductItemDetails extends Components {
    statue={
        productDate: {},
        SimilarProductItem: [],
        apiStatus: apiStatusConstants.initial,
        quantity: 1,
    }

    componentDidMount(){
        this.getPreoductData()
    }

    getFormattedData = data => ({
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.imageUrl,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.totalReviews,
        
    })


    getProductData = async () => {
        const {match} = this.props
        const {params} = match 
        const {id} = params


        this.setState({
            apiStatus: apiStatusConstants.inProgress,
        })

        const jwtToken = Cookies.get('jwt_token')
        const apiUrl = `https://apis.ccbp.in/products/${id}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,

            },
            method:'GET',
        }


        const response = await fetch(apiUrl, options)

        if (response.ok) {
            const fetchedData = await response.json()
            const updatedData = this.getFormattedData(fetchedData)
            const updatedSimilarProductsData = fetchedData.similar_products.map()
            eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
            )

            this.setState({
                productDate: updatedData;
                SimilarProductsData: updatedSimilarProductsData,
                apiStatus: apiStatusConstants.success,
            })
        }
    }



    renderLoadingView = () => (
        <div className="products-details-loader-container" data-testid="loader">

        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
        
        
        
        
        
        </div>
    )

renderFailureView = () => (
    <div className="product-details-failure-view-container">
    <img
    alt="failure view"
    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
    className="failure-view-image"
    />
    <h1 className="product-not-found-heading">Product Not Found</h1>
    <Link to="/products">
    <button type="button" className="button">
    Continue Shopping
    
    </button>
    
    </Link>
    
    </div>
)


onDecrementQuantity = () => {
    const {quantity} = this.state 
    if (quantity > 1) {
        this.setState(prevState => ({
            quantity: prevState.quantity -1
        }))
    }
}


onIncrementQuantity = () => {
    this.setState(prevState => ({
        quantity: prevState.quantity +1
    }))
}


renderProductDetailsView = () => {
    const {productDate, quantity, similarProductData} = this.state 
    const {
        availability,
        brand,
        description,
        imageUrl,
        price,
        rating,
        title,
        totalReviews,
    } = productDate


    return (
        <div className="product-details-success-view">
        <div className="product-details-container">
        <img src={imageUrl} alt="products" className="product-image" />
        <div className="product">
        <h1 className="product-name">{title}</h1>
        <p className="price-details">Rs {price}/-</p>
        <div className="ratings-and-reviews-count">
        <div className="rating-and-reviews-count">
        <div className="ratings-container">
        <p className="rating">{rating}</p>
        <img 
        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
        alt="star"
        className="star"/>


        
        </div>

        <p className="reviews-count">{totalReviews}</p>
        
        </div>
        <p className="product-description">{description}</p>
        <div className="label-value-container">
        <p className="label">Availbale</p>
        <p className="label">{availability}</p>
        
        </div>


        <div className="label-value-container">
        <p className="brand">Brand</p>
        <p className="value">{brand}</p>
        
        
        </div>
        <hr className="horizontal-line"/>

        <div className="quantity-container">
        <button
        type="button"
        className="quantity-controller-button"
        onClick={this.onDecrementQuantity}
        data-testid="minus"
        >
        <BsDashSquare className="quantity-controller-icon" />
        </button>

        <p className="quantity">{quantity}</p>
        
        <button
        type="button"
        className="quantity-controller-button"
        onClick={this.onIncrementQuantity}
        data-testid="plus">
        

        <BsPlusSquare  className="quantity-controller-icon"/>
        
        </button>
        <p className="quantity">{quantity}</p>

        <button
        type="button"
        className="quantity-controller-button"
        onClick={this.onIncrementQuantity}
        data-testid="plus">
        <BsPlusSquare className="quantity-controller-icon" />

        
        </button>



        
        </div>

        <button type="button" className="button add-to-cart-btn">
            ADD TO CART
        </button>
        
        </div>
        
        
        
        </div>
        
        
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-list">
        {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
            productDetails={eachSimilarProduct}
            key={eachSimilarProduct.id}/>
        ))}
        
        </ul>
        </div>
        
        
       
    )
}


renderProductDetails = () => {
    const (apiStatus) = this.state

    switch (apiStatus) {
        case apiStatusConstants.success:
        return  this.renderProductDetailsView()

        case apiStatusConstants.failure:
        return this.renderFailureView()

        case apiStatusConstants.inProgress:
        return this.renderLoadingView()

        defaul:
        return null



    }
}

render(){
    return (
        <>

        <Header/>
        <div className="product-item-details-container">
        {this.renderProductDetailsView()}
        
        </div>
        </>
    )
}
}

export default ProductItemDetails