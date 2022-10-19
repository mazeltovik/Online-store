import { ResponseArray, ResponseData, Opt, func, OptMethods } from '../../models/Types';

const SELECTORS = {
    main: document.querySelector('main') as HTMLElement,
    mainProducts: document.querySelector('.main_products') as HTMLDivElement,
    productTemplate: document.querySelector('.product_template') as HTMLTemplateElement,
    price: document.querySelector('.price') as HTMLParagraphElement,
    counter: document.querySelector('.cart_counter') as HTMLSpanElement,
} as const;

class Filters {
    currentData: ResponseArray | undefined;
    main;
    mainProducts;
    productTemplate;
    search;
    searchControl;
    sortInput;
    category;
    company;
    colors;
    slider;
    price;
    clearButton;
    selectCategory: HTMLButtonElement | null;
    selectColor: HTMLParagraphElement | null;
    opt: Opt;
    counter;
    count;
    optMethods: OptMethods;
    constructor(public allData: ResponseArray | undefined) {
        this.currentData = [];
        this.main = SELECTORS.main;
        this.mainProducts = SELECTORS.mainProducts;
        this.productTemplate = SELECTORS.productTemplate;
        this.search = document.querySelector('.search_input') as HTMLInputElement;
        this.searchControl = document.querySelector('.search') as HTMLDivElement;
        this.sortInput = document.querySelector('.sort_input') as HTMLSelectElement;
        this.category = document.querySelector('.btn_category') as HTMLDivElement;
        this.company = document.querySelector('.company') as HTMLSelectElement;
        this.colors = document.querySelector('.colors') as HTMLDivElement;
        this.price = document.querySelector('.price') as HTMLParagraphElement;
        this.slider = document.querySelector('.slider') as HTMLInputElement;
        this.clearButton = document.querySelector('.clear-btn') as HTMLButtonElement;
        this.counter = SELECTORS.counter;
        this.selectCategory = null;
        this.selectColor = null;
        this.count = 0;
        this.opt = {
            search: '',
            sort: 'price-lowest',
            category: 'all',
            company: 'all',
            color: '',
            price: '',
            count: '0',
        };
        this.optMethods = {
            search(data: ResponseArray, key: string) {
                let result = this.searchFilter(data, key);
                console.log(this.searchFilter);
                return result;
            },
        };
    }
    searchFilter(data: ResponseArray, key: string): ResponseArray | void {
        return data?.filter((v) => {
            if (v.name.toString().includes(this.opt[key])) {
                return v.name;
            }
        });
    }
    categoryFilter(data: ResponseArray, key: string): ResponseArray {
        return data?.filter((v) => {
            if (this.opt.category == 'all') {
                return v.category;
            }
            return v.category == this.opt[key];
        });
    }
    companyFilter(data: ResponseArray, key: string): ResponseArray {
        return data?.filter((v) => {
            if (this.opt.company == 'all') {
                return v.company;
            }
            return v.company == this.opt[key];
        });
    }
    colorFilter(data: ResponseArray, key: string): ResponseArray {
        return data?.filter((v) => {
            if (this.opt.color == 'all') {
                return v.colors;
            }
            if (Array.isArray(v.colors)) {
                return v.colors.includes(this.opt.color);
            }
        });
    }
    priceFilter(data: ResponseArray, key: string): ResponseArray {
        return data?.filter((v) => {
            return +v.price <= +this.opt.price;
        });
    }
    sortFilter(data: ResponseArray | undefined, key: string): ResponseArray | undefined {
        return this.opt[key] == 'price-highest'
            ? (data = this.sortByHighest(data))
            : this.opt[key] == 'price-lowest'
            ? (data = this.sortByHighest(data)?.reverse())
            : this.opt[key] == 'name-a'
            ? (data = this.sortByA(data))
            : (data = this.sortByA(data)?.reverse());
    }
    beautyPrice(price: number): string {
        let strPrice = String(price);
        let index = strPrice.match(/\d{2}$/)?.index;
        return `$${strPrice.slice(0, index)},${strPrice.slice(index)}`;
    }
    loadHandler(): void {
        Object.keys(localStorage).forEach((v) => {
            let value = localStorage.getItem(v);
            if (value) {
                this.opt[v] = value;
            }
        });
        if (!this.opt.price) {
            this.opt.price = '309999';
        }
        this.search.value = this.opt.search;
        this.sortInput.value = this.opt.sort;
        this.company.value = this.opt.company;
        this.slider.value = this.opt.price;
        this.price.innerHTML = this.beautyPrice(Number(this.opt.price));
        this.counter.innerText = this.opt.count;
        this.filter(this.allData);
    }
    searchControlHandler(): void {
        this.searchControl.addEventListener('click', (event) => {
            let target = (event.target as HTMLElement).closest('svg');
            if (target && target.classList.contains('search_icon')) {
                this.search.focus();
            }
            if (target && target.classList.contains('search_delete')) {
                this.search.value = '';
                this.opt.search = '';
                localStorage.setItem('search', this.opt.search);
                target.style.display = 'none';
                this.filter(this.allData);
                this.search.focus();
            }
        });
    }
    filterSearch(): void {
        this.search.addEventListener('input', (event) => {
            let target = event.target as HTMLInputElement;
            this.opt.search = target.value.toLowerCase();
            localStorage.setItem('search', this.opt.search);
            if (target.value) {
                (document.querySelector('.search_delete') as SVGAElement).style.display = 'block';
            }
            this.filter(this.allData);
        });
    }
    sortHandler(): void {
        this.sortInput.addEventListener('change', (event) => {
            let target = event.target as HTMLSelectElement;
            this.opt.sort = target.value;
            localStorage.setItem('sort', this.opt.sort);
            this.filter(this.allData);
        });
    }
    filterCategory(): void {
        this.category.addEventListener('click', (event) => {
            let target = event.target as HTMLButtonElement;
            if (target.tagName == 'BUTTON') {
                this.opt.category = target.innerHTML;
                localStorage.setItem('category', this.opt.category);
                this.addBorderCategory(target);
                this.filter(this.allData);
            }
        });
    }
    filterCompany(): void {
        this.company.addEventListener('change', (event) => {
            let target = event.target as HTMLSelectElement;
            this.opt.company = target.value;
            localStorage.setItem('company', this.opt.company);
            this.filter(this.allData);
        });
    }
    filterColor(): void {
        this.colors.addEventListener('click', (event) => {
            let target = event.target as HTMLParagraphElement;
            if (target.tagName == 'P') {
                this.opt.color = target.getAttribute('color')!;
                localStorage.setItem('color', this.opt.color);
                this.addActiveColorClass(target);
                this.filter(this.allData);
            }
        });
    }
    filetrPrice(): void {
        this.slider.addEventListener('input', (event) => {
            let target = event.target as HTMLInputElement;
            this.price.innerHTML = this.beautyPrice(Number(target.value));
            this.opt.price = target.value;
            localStorage.setItem('price', this.opt.price);
            this.filter(this.allData);
        });
    }
    clearFilter(): void {
        this.clearButton.addEventListener('click', (e) => {
            this.opt.search = '';
            this.opt.category = 'all';
            this.opt.company = 'all';
            this.opt.color = 'all';
            this.opt.price = '309999';
            localStorage.clear();
            this.filter(this.allData);
            this.search.value = '';
            this.search.focus();
            if (this.selectCategory) {
                this.selectCategory.classList.remove('active');
                (
                    document.querySelector(
                        'body > main > section > form > div:nth-child(3) > div > button:nth-child(2)'
                    ) as HTMLButtonElement
                ).classList.add('active');
            }
            this.company.value = 'all';
            if (this.selectColor) {
                if (this.selectColor.classList.contains('color-btn')) {
                    this.selectColor.classList.remove('active_color');
                }
                (document.querySelector('.all-btn') as HTMLParagraphElement).classList.add('active_all_color');
            }
            this.price.innerHTML = '$3099,99';
            this.slider.value = '309999';
        });
    }
    addBorderCategory(target: HTMLButtonElement): void {
        (
            document.querySelector(
                'body > main > section > form > div:nth-child(3) > div > button.null.active'
            ) as HTMLButtonElement
        ).classList.remove('active');
        if (this.selectCategory) {
            this.selectCategory.classList.remove('active');
        }
        this.selectCategory = target;
        this.selectCategory.classList.add('active');
    }
    addActiveColorClass(target: HTMLParagraphElement): void {
        (document.querySelector('.all-btn') as HTMLParagraphElement).classList.remove('active_all_color');
        if (this.selectColor) {
            if (this.selectColor.classList.contains('all-btn')) {
                this.selectColor.classList.remove('active_all_color');
            } else {
                this.selectColor.classList.remove('active_color');
            }
        }
        this.selectColor = target;
        if (this.selectColor.classList.contains('all-btn')) {
            this.selectColor.classList.add('active_all_color');
        } else {
            this.selectColor.classList.add('active_color');
        }
    }
    sortByHighest(data: ResponseArray | undefined): ResponseArray | undefined {
        if (data) {
            return data.sort((a, b) => {
                return Number(b.price) - Number(a.price);
            });
        }
    }
    sortByA(data: ResponseArray | undefined): ResponseArray | undefined {
        if (data) {
            return data.sort((a, b) => {
                return (a.name as string).localeCompare(b.name as string);
            });
        }
        return data;
    }
    filter(res: ResponseArray | undefined): void {
        this.currentData = res;
        for (let key in this.opt) {
            if (this.opt[key]) {
                this.currentData =
                    key == 'search'
                        ? this.searchFilter(this.currentData as ResponseArray, key)
                        : key == 'sort'
                        ? this.sortFilter(this.currentData as ResponseArray, key)
                        : key == 'category'
                        ? this.categoryFilter(this.currentData as ResponseArray, key)
                        : key == 'company'
                        ? this.companyFilter(this.currentData as ResponseArray, key)
                        : key == 'color'
                        ? this.colorFilter(this.currentData as ResponseArray, key)
                        : this.priceFilter(this.currentData as ResponseArray, key);
            }
        }
        if (this.currentData?.length == 0) alert('Извините, совпадений не обнаружено');
        this.draw(this.currentData);
    }
    draw(data: ResponseArray | undefined): this | void {
        const fragment = document.createDocumentFragment();
        const main_products = document.querySelector('.main_products') as HTMLDivElement;
        main_products.remove();
        if (data) {
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
                (productClone.querySelector('.product_footer h5') as HTMLHeadingElement).textContent =
                    v.name.toString();
                (productClone.querySelector('.product_footer p') as HTMLParagraphElement).textContent =
                    this.beautyPrice(Number(v.price));
                fragment.append(productClone);
            });
        }
        let mainDiv = document.createElement('div');
        mainDiv.className = 'main_products';
        mainDiv.append(fragment);
        mainDiv.addEventListener('click', (event) => {
            let btn = (event.target as HTMLElement).closest('button');
            if (btn && btn.textContent == 'Add') {
                if (this.count < 20) {
                    this.count++;
                    localStorage.setItem('count', this.count.toString());
                } else {
                    alert('Извините, все слоты заполнены');
                }
                this.counter.innerText = this.count.toString();
            }
            if (btn && btn.textContent == 'Remove') {
                if (this.count > 0) {
                    this.count--;
                    localStorage.setItem('count', this.count.toString());
                }
                this.counter.innerText = this.count.toString();
            }
        });
        this.main.append(mainDiv);
        return this;
    }
    showMethods(allData: ResponseArray | undefined) {
        for (let key in this.opt) {
            if (allData && key == 'search') {
                console.log(this.optMethods[key]);
            }
        }
    }
}

export default Filters;
