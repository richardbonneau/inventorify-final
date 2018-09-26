import React, { Component } from 'react';
import { GENRE, BASE, TAILLE, COULEUR, STORELOCATION } from './Variantes'
import { Layout, TextField, FormLayout, Select, Button, ChoiceList, Banner } from '@shopify/polaris';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: [],
            isFetchLoading: false,

            gender: "",
            base: "",
            size: "",
            color: "",

            listProductsToModify: [],

            variantIds: [],
            inventoryIds: [],

            quantityInput: "",
            priceInput: "",
            isApplyInventoryLoading: false,
            isApplyPricesLoading: false,
            isApplyInventoryDisabled: false,
            isApplyPricesDisabled: false,

            numModifLeft: 0,
        }
    }


    componentDidMount = () => {
        this.fetchAllProducts();
    }

    fetchAllProducts = () => {
        //  On reset l'array "listProducts" pour avoir un clean slate lorsque le user fait une nouvelle recherche
        this.setState({ listProducts: [], isFetchLoading: true })
        return fetch('/shopify/api/products.json')
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ isFetchLoading: false })
                this.putDataInState(responseJson);

            })
    }
    //  REFACTORING: this could probably be two lines of code instead of 5
    putDataInState = (object) => {
        let list = [];
        object.products.forEach(product => {
            list.push(product);
        })
        this.setState({ fetched: list }, () => this.filterProducts())
    }


    filterProducts = () => {
        let filterGender = this.state.fetched.filter((product) => product.title.toLowerCase().includes(this.state.gender));
        let filterBase = filterGender.filter((product) => product.title.toLowerCase().includes(this.state.base));
        let filterSize = [...filterBase];
        filterSize.forEach((product) => {
            if (this.state.size !== "") {
                let newVariants = [];
                product.variants.forEach((variant) => {
                    if (variant.option1 === this.state.size) newVariants.push(variant);
                })
                product.variants = newVariants
            }
        })
        let filterColor = [...filterSize];
        filterColor.forEach((product) => {
            if (this.state.color !== "") {
                let newVariants = [];
                product.variants.forEach((variant) => {
                    if (variant.option2 === this.state.color) newVariants.push(variant);
                })
                product.variants = newVariants
            }
        })

        let letVariantIds = [];
        let letInventoryIds = [];
        filterColor.forEach((product) => {
            product.variants.forEach((variant) => {
                letVariantIds.push(variant.id);
                letInventoryIds.push(variant.inventory_item_id);
            })
        })

        this.setState({
            listProductsToModify: filterColor,
            variantIds: letVariantIds,
            inventoryIds: letInventoryIds
        })
    }


    //  Apply Changes
    applyChangesToInventory = () => {
        let result = window.confirm(
            "Vous êtes sur le point de modifier l'inventaire de " + this.state.inventoryIds.length + " variantes.\nÊtes-vous sûr de vouloir continuer?"
        );

        let delayIncrement = 500;
        let delay = 0;

        if (result == true) {
            this.setState({ isApplyInventoryLoading: true, isApplyPricesDisabled: true })
            let array = new Array();
            var fetches = [];
            for (let i = 0; i < this.state.inventoryIds.length; i++) {
                let inventoryBody = {
                    "inventory_item_id": this.state.inventoryIds[i],
                    "location_id": STORELOCATION,
                    "available": Number(this.state.quantityInput)
                };
                fetches.push(
                    new Promise(resolve => setTimeout(resolve, delay)).then(() =>
                        fetch('/shopify/api/inventory_levels/set.json', {
                            method: "POST",
                            body: JSON.stringify(inventoryBody)
                        }))
                        .then(response => response.json())
                        .then(responseJson => {

                            array.push(responseJson);
                        })
                );
                delay += delayIncrement
            }

            Promise.all(fetches).then(() => {
                console.log("all", array.length, "fetches done")
                this.setState({ isApplyInventoryLoading: false })
                alert("Les " + array.length + " variantes ont étés modifiés avec succès. La page va maintenant être rafrachie.");
                location.reload();
            });
        }
    }

    applyChangesToPrice = () => {
        let result = window.confirm(
            "Vous êtes sur le point de modifier le prix de " + this.state.inventoryIds.length + " variantes.\nÊtes-vous sûr de vouloir continuer?"
        );

        let delayIncrement = 500;
        let delay = 0;

        if (result == true) {
            this.setState({ isApplyPricesLoading: true, isApplyInventoryDisabled: true })
            let array = new Array();
            var fetches = [];
            for (let i = 0; i < this.state.variantIds.length; i++) {
                let priceBody = {
                    "variant": {
                        "id": this.state.variantIds[i],
                        "price": this.state.priceInput
                    }
                }
                fetches.push(
                    new Promise(resolve => setTimeout(resolve, delay)).then(() =>
                        fetch('/shopify/api/variants/' + this.state.variantIds[i] + '.json', {
                            method: "PUT",
                            body: JSON.stringify(priceBody)
                        }))
                        .then(response => response.json())
                        .then(responseJson => {
                            // console.log(responseJson);
                            array.push(responseJson)
                        })
                );
                delay += delayIncrement
            }
            Promise.all(fetches).then(() => {
                console.log("all", array.length, "fetches done")
                this.setState({ isApplyPricesLoading: false })
                alert("Les " + array.length + " variantes ont étés modifiés avec succès. La page va maintenant être rafrachie.");
                location.reload();
            });
        }
    }

    //  Handlers
    handleSelectChange = (value) => { this.setState({ categorySelect: value }) }
    handleSearchChange = (value) => { this.setState({ searchInput: value }) }
    handleQuantityChange = (value) => { this.setState({ quantityInput: value }) }
    handlePriceChange = (value) => { this.setState({ priceInput: value }) }

    handleGenderChange = (value) => { this.setState({ gender: value }, () => this.filterProducts()); }
    handleBaseChange = (value) => { this.setState({ base: value }, () => this.filterProducts()); }
    handleSizeChange = (value) => { this.setState({ size: value }, () => this.filterProducts()); }
    handleColorChange = (value) => { this.setState({ color: value }, () => this.filterProducts()); }


    render() {
        return (
            <div >
                <div style={{ height: '10px' }} />
                <FormLayout>
                    <Select
                        label="Genre"
                        options={GENRE}
                        onChange={this.handleGenderChange}
                        value={this.state.gender}
                    />
                    <Select
                        label="Base"
                        options={BASE}
                        onChange={this.handleBaseChange}
                        value={this.state.base}
                    />
                    <Select
                        label="Taille"
                        options={TAILLE}
                        onChange={this.handleSizeChange}
                        value={this.state.size}
                    />
                    <Select
                        label="Couleur"
                        options={COULEUR}
                        onChange={this.handleColorChange}
                        value={this.state.color}
                    />
                </FormLayout>

                <div style={{ height: '15px' }} />

                <FormLayout.Group>
                    <TextField label="Quantité" type="number" onChange={this.handleQuantityChange} value={this.state.quantityInput} />
                    <TextField label="Prix" prefix="$" type="number" onChange={this.handlePriceChange} value={this.state.priceInput} />
                </FormLayout.Group>

                <FormLayout.Group>
                    <Button primary
                        fullWidth={true}
                        onClick={this.applyChangesToInventory}
                        loading={this.state.isApplyInventoryLoading}
                        disabled={this.state.isApplyInventoryDisabled} >
                        Changer l'Inventaire
                    </Button>

                    <Button primary
                        fullWidth={true}
                        onClick={this.applyChangesToPrice}
                        loading={this.state.isApplyPricesLoading}
                        disabled={this.state.isApplyPricesDisabled} >
                        Changer Prix
                    </Button>
                </FormLayout.Group>


                <div style={{ height: "30px" }} />
            </div>
        )
    }
}