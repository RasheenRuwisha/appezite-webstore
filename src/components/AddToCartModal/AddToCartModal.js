import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Alert
} from 'reactstrap';
import '../Home/Home.css';
import {connect} from 'react-redux';
import PropType from 'prop-types'
import {login} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';
import {addToCart} from '../../actions/cartActions';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {toastr} from 'react-redux-toastr'

class AddToCartModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        value: 1,
        price: 0,
        initPrice: 0,
        checkboxesValue: [],
        checkBoxMax: [],
        varPrice: 0,
        varName: null,
        totalAddonsPrice: 0
    };

    static propTypes = {
        isAuthenticated: PropType.bool,
        clearErrors: PropType.func.isRequired,
        error: PropType.object.isRequired,
        login: PropType.func.isRequired,
        categories: PropType.object.isRequired,
        products: PropType.object.isRequired,
        business: PropType.object.isRequired
    }

    componentDidUpdate(previousProps) {
        const {error, isAuthenticated, product} = this.props;
        if (error != previousProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({msg: error.msg.msg})
            } else {
                this.setState({msg: null})
            }
        }

        if(product != previousProps.product){
            this.initModal();
        }

    }

    // init the modal with the product details
    initModal() {
        var addons = this.props.product.addons;
        let max = [];
        // loop though addons and create a new list with the max number allowed and mandatory checks
        for (let i = 0; i < addons.length; i++) {
            let checkBoxMax = {
                name: addons[i].name,
                max: addons[i].maximimCount,
                mandatory: addons[i].addonMandatory,
                current: 0
            }
            max.push(checkBoxMax);
        }

        this.setState({checkBoxMax: max})
        var price = 0;
        var varPrice = 0;
        var name = null;
        // check for the variants and set the prize of the first variant if it exists
        if (this.props.product.variant.variants.length > 0) {
            price = this.props.product.variant.variants[0].price;
            varPrice = this.props.product.variant.variants[0].price;
            name = this.props.product.variant.variants[0].name;
        } else {
            price = this.props.product.price
        }
        this.setState({modal: this.props.modal, price: price, initPrice: this.props.product.price, varName: name, varPrice: varPrice});
    }

    componentDidMount() {
        this.initModal();
    }

    toggle = () => {
        this
            .props
            .clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    incrementCount = () => {
        let price = 0;
        // get the current price and increase the price with the count
        if (this.state.varPrice === 0) {
            price = parseFloat(this.state.price) + parseFloat(this.state.initPrice)
        } else {
            price = parseFloat(this.state.price) + parseFloat(this.state.varPrice)
        }
        price = price + this.state.totalAddonsPrice;
        this.setState({
            value: this.state.value + 1,
            price: price
        })
    }

    decrementCount = () => {
        // get the current price and increase the price with the count
        if (this.state.value > 1) {
            let price = 0;
            if (this.state.varPrice === 0) {
                price = parseFloat(this.state.price) - parseFloat(this.state.initPrice)
            } else {
                price = parseFloat(this.state.price) - parseFloat(this.state.varPrice)
            }
            price = price - this.state.totalAddonsPrice;
            this.setState({
                value: this.state.value - 1,
                price: price
            })
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    // submit item to add to cart
    onSubmit = e => {
        e.preventDefault();
        let msg = null;
        let checkBoxMax = this.state.checkBoxMax
        for (let i = 0; i < checkBoxMax.length; i++) {
            if (checkBoxMax[i].mandatory && checkBoxMax[i].current == 0) {

                msg = `Please select atleast 1 ${checkBoxMax[i].name}`;
                this.setState({msg: `Please select atleast 1 ${checkBoxMax[i].name}`})
                break;
            } else {
                this.setState({msg: null})
            }
        }

        if (msg === null) {
            e.preventDefault();

            // create new car item
            var cartItem = {
                name: this.props.product.name,
                image: this.props.product.image,
                quantity: this.state.value,
                price: this.state.price,
                addons: this.state.checkboxesValue,
                variant: this.state.varName,
                variantPrice: this.state.varPrice
            }
            this
                .props
                .addToCart(cartItem)
            for (let i = 0; i < checkBoxMax.length; i++) {
                checkBoxMax[i].current = 0;
            }
            this.setState({checkBoxMax: checkBoxMax})
            this.setState({
                modal: false,
                email: '',
                password: '',
                msg: null,
                value: 1,
                price: 0,
                initPrice: 0,
                checkboxesValue: [],
                checkBoxMax: [],
                varPrice: 0,
                varName: null,
                totalAddonsPrice: 0
            })
            this.initModal();
            toastr.success('Cart', 'The product was added to the cart successfully');
            this.toggle();
        }
    };

    // function to update addons list when chedked
    addCheckboxesValue = (event, parentAddon, childAddon) => {
        let price = this.state.price;
        let value = {
            parent: parentAddon,
            child: childAddon.name,
            price: childAddon.price
        }
        const {checkboxesValue} = this.state
        let updatedCheckboxesValue = [...checkboxesValue];
        let checkBoxMax = this.state.checkBoxMax;
        // find the checkmax object with the parentAddon Name and child name
        let obj = updatedCheckboxesValue.find(x => x.parent === parentAddon && x.child === childAddon.name);
        let index = updatedCheckboxesValue.indexOf(obj);
        // find the checkmax object with the parentAddon Name
        let obj1 = checkBoxMax.find(x => x.name === parentAddon);

        let totalAddonPrice = this.state.totalAddonsPrice;

        // check wether the number of max allowed addons are used
        if (obj1.max > obj1.current) {
            // remove item from list if the index is less than -1
            if (index > -1) {
                obj1.current--;
                updatedCheckboxesValue.splice(index, 1);
                price = parseFloat(this.state.price) - (parseFloat(childAddon.price) * parseFloat(this.state.value))
                totalAddonPrice = parseFloat(totalAddonPrice) - parseFloat(childAddon.price)
            } else {
                // add item to addon list
                obj1.current++;
                price = parseFloat(this.state.price) + (parseFloat(childAddon.price) * parseFloat(this.state.value))
                totalAddonPrice = parseFloat(totalAddonPrice) + parseFloat(childAddon.price)
                updatedCheckboxesValue = [
                    ...checkboxesValue,
                    value
                ];
            }
        } else {
            if (index > -1) {
                obj1.current--;
                updatedCheckboxesValue.splice(index, 1);
                price = parseFloat(this.state.price) - (parseFloat(childAddon.price) * parseFloat(this.state.value))
                totalAddonPrice = parseFloat(totalAddonPrice) - parseFloat(childAddon.price)
            }
            event.target.checked = false;
            event.stopPropagation();
        }

        this.setState({checkboxesValue: updatedCheckboxesValue, price: price, checkBoxMax: checkBoxMax, totalAddonsPrice: totalAddonPrice})

    }

    handleChange = () => event => {
        var index = event.nativeEvent.target.selectedIndex;

        var price = parseFloat(this.state.price)
        var varPrice = parseFloat(this.state.varPrice);
        var varName = event.nativeEvent.target[index].text
        price = parseFloat(price) - (parseFloat(varPrice) * this.state.value);
        price = parseFloat(price) + (parseFloat(event.target.value) * this.state.value);

        varPrice = parseFloat(event.target.value);
        this.setState({varPrice: varPrice, varName: varName, price: price})
    };

    // render variants as a dropdown
    renderVariant() {
        let variant = this.props.product.variant
        let variantOptions = []
        for (let i = 0; i < variant.variants.length; i++) {
            variantOptions.push(
                <option value={variant.variants[i].price}>{variant.variants[i].name}</option>
            )
        }
        var variantRender = null;
        if (variant.variants.length > 0) {
            variantRender = <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple">
                    {variant.name}
                </InputLabel>
                <Select
                    native
                    onChange={this.handleChange()}
                    labelWidth={400}
                    inputProps={{
                    name: 'age',
                    id: 'outlined-age-native-simple'
                }}>
                    {variantOptions}
                </Select>
            </FormControl>
        }

        return variantRender;
    }

    // render the addons
    renderAddons() {
        let addonsRender = [];
        let addons = this.props.product.addons
        for (let i = 0; i < addons.length; i++) {
            let addonsGroups = [];
            for (let z = 0; z < addons[i].addons.length; z++) {
                let parentAddon = addons[i].name
                let childAddon = addons[i].addons[z]
                addonsGroups.push(
                    <FormControlLabel
                        style={{
                        width: '100%'
                    }}
                        onClick={(e) => {
                        this.addCheckboxesValue(e, parentAddon, childAddon)
                    }}
                        labelPlacement="end"
                        control={< Checkbox false value = {
                        addons[i].addons[z].name
                    } />}
                        label={`${addons[i].addons[z].name} ${ (Math.round(addons[i].addons[z].price * 100) / 100).toFixed(2)} `}/>
                )
            }
            addonsRender.push(
                <div>
                    <p>{addons[i].name}
                    </p>

                    <FormLabel component="legend">Max allowed addons : {addons[i].maximimCount}</FormLabel>
                    {addonsGroups}
                    <hr></hr>
                </div>
            );
        }
        return addonsRender;
    }

    render() {
        const product = this.props.product;
        return (
            <div>
                <IconButton aria-label="add to favorites" onClick={this.toggle}>
                    <AddShoppingCartIcon/>
                </IconButton>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{product.name}</ModalHeader>
                    {this.state.msg
                        ? <Alert color="danger">{this.state.msg}</Alert>
                        : null}
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>

                                <div>
                                    {this.renderVariant()}
                                </div>
                                <hr></hr>
                                <div>
                                    {this.renderAddons()}
                                </div>

                                <p>Quantity</p>
                                <div className="qty-input">
                                    <i className="less" onClick={this.decrementCount}>-</i>
                                    <input type="text" value={this.state.value}/>
                                    <i className="more" onClick={this.incrementCount}>+</i>
                                </div>
                                <p></p>

                                <Button
                                    disabled
                                    color='dark'
                                    style={{
                                    textAlign: 'left',
                                    marginTop: '2rem'
                                }}
                                    block>
                                    {`Total Price : ${ (Math.round(this.state.price * 100) / 100).toFixed(2)}`}
                                </Button>

                                <Button
                                    color='dark'
                                    style={{
                                    background: this.props.business.business.theme.dark
                                }}
                                    block>
                                    Add To Cart
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({isAuthenticated: state.auth.isAuthenticated, error: state.error, categories: state.categories, business: state.business, products: state.products});

export default connect(mapStateToProps, {login, clearErrors, addToCart})(AddToCartModal);
