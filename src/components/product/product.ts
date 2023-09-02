import getProductById from '../../services/getProductById';
import BaseComponent from '../base-component';
import Button from '../button/button';
import { ProductData } from '@commercetools/platform-sdk';
import './product.scss';

interface ProductAttributes {
  [name: string]: string;
}

export default class Product extends BaseComponent<'div'> {
  private addToCartBtn: HTMLButtonElement;
  private productData: ProductData | null = null;
  private productAttributes: ProductAttributes = {
    rating: '-',
    reviews: '0',
    days: 'Please ask about tour duration by writing to us at this.is.this@gmail.com',
    inStock: 'Please check availability by writing to us at this.is.this@gmail.com',
    location: 'Paradise',
    shortDescription: 'No information about this tour',
    adventureStyle: 'Relax',
    aboutTour: 'No information about this tour',
  };

  constructor(id: string) {
    super('div', ['product']);

    this.addToCartBtn = new Button('button', 'Add To Card', [], false, () => this.addToCart(id)).getElement();

    this.createMarkup(id);
  }

  async createMarkup(id: string) {
    await this.getProductData(id);
    this.getProductAttributes();

    const productInfo = this.drawProductInfo();
    const productForm = this.drawProductForm();
    const productAbout = this.drawProductAbout();

    this.node.append(productInfo, productForm, productAbout);
  }

  private drawProductInfo() {
    const title = this.productData?.name.en || 'This is the best tour in your life!';
    const { rating, reviews, inStock, shortDescription, adventureStyle } = this.productAttributes;

    const productRoutes = new BaseComponent('p', ['product__routes'], adventureStyle).getElement();
    const productInfo = new BaseComponent('div', ['product__info']).getElement();
    const productOpinion = new BaseComponent('div', ['product__opinion']).getElement();
    const productTitle = new BaseComponent('h2', ['product__title'], title).getElement();
    const productRating = new BaseComponent('p', ['product__rating'], rating).getElement();
    const productReviews = new BaseComponent('p', ['product__reviews'], `${reviews}+ Reviews`).getElement();
    const productDescription = new BaseComponent('p', ['product__description'], shortDescription).getElement();
    const productStock = new BaseComponent('p', ['product__stock'], `${inStock} In Stock`).getElement();

    productOpinion.append(productRating, productReviews);
    productInfo.append(productRoutes, productTitle, productOpinion, productDescription, productStock);

    return productInfo;
  }

  private getProductAttributes() {
    const attributes = this.productData?.masterVariant.attributes;

    if (attributes) {
      for (const key of attributes) {
        if (key.name in this.productAttributes) {
          this.productAttributes[key.name] = key.value;
        }
      }
    }
  }

  private drawProductForm() {
    const productForm = new BaseComponent('div', ['product__add-to-cart']).getElement();

    productForm.append(this.addToCartBtn);

    return productForm;
  }

  private drawProductAbout() {
    const { aboutTour, location } = this.productAttributes;

    const productAbout = new BaseComponent('ul', ['product__about']).getElement();
    const productAboutItem = new BaseComponent('li', ['product__about-item'], 'About Tour').getElement();
    const productLocationItem = new BaseComponent('li', ['product__about-item'], 'Location').getElement();

    aboutTour
      .slice(0, -1)
      .split('.')
      .forEach((sentence) => {
        const aboutTourSentence = new BaseComponent('p', ['product__description'], `${sentence}.`).getElement();

        productAboutItem.append(aboutTourSentence);
      });

    const productLocation = new BaseComponent('p', ['product__description'], location).getElement();

    productLocationItem.append(productLocation);
    productAbout.append(productAboutItem, productLocationItem);

    return productAbout;
  }

  private addToCart(id: string) {
    console.log(`TODO: create func add to cart. Product ID: ${id}`);
  }

  private async getProductData(id: string) {
    try {
      const product = await getProductById(id);

      this.productData = product.masterData.current;
    } catch (err) {
      console.log(err);
    }
  }
}