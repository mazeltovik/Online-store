import { ResponseArray, ResponseData } from '../../../models/Types';
import './products.scss';
class Products {
    public main;
    public productTemplate;
    public categoryTemplate;
    constructor() {
        this.main = document.querySelector('main') as HTMLElement;
        this.productTemplate = document.querySelector('.product_template') as HTMLTemplateElement;
        this.categoryTemplate = document.querySelector('.category_template') as HTMLTemplateElement;
    }
    beautyPrice(price: number): string {
        let strPrice = String(price);
        let index = strPrice.match(/\d{2}$/)?.index;
        return `$${strPrice.slice(0, index)},${strPrice.slice(index)}`;
    }
    draw(data: ResponseArray): this | void {
        const fragment = document.createDocumentFragment();
        data.forEach((v) => {
            const productClone = this.productTemplate.content.cloneNode(true) as DocumentFragment;
            (productClone.querySelector('.products_container') as HTMLDivElement).setAttribute(
                'category',
                v.category.toString()
            );
            (productClone.querySelector('.products_container') as HTMLDivElement).setAttribute(
                'company',
                v.company.toString()
            );
            (productClone.querySelector('.main_img img') as HTMLImageElement).src = v.image.toString();
            (productClone.querySelector('.product_footer h5') as HTMLHeadingElement).textContent = v.name.toString();
            (productClone.querySelector('.product_footer p') as HTMLParagraphElement).textContent = this.beautyPrice(
                Number(v.price)
            );
            fragment.append(productClone);
        });
        let mainDiv = document.createElement('div');
        mainDiv.className = 'main_products';
        mainDiv.append(fragment);
        this.main.append(mainDiv);
        return this;
    }
    drawCategory(): this {
        const categoryClone = this.categoryTemplate.content.cloneNode(true) as DocumentFragment;
        this.main.append(categoryClone.querySelector('.category_section') as HTMLDivElement);
        return this;
    }
    deleteDoubleCategory(): this {
        let dCat = this.main.children[1] as HTMLElement;
        dCat.remove();
        return this;
    }
}

export default Products;
