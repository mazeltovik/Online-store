import './global.scss';
import { ResponseArray, Callback } from './models/Types';
import Loader from './components/controller/loader';
import Products from './components/view/products/products';
import Filters from './components/filter/filters';

class App {
    public loader: Loader;
    public view: Products;
    public filters: Filters | null;
    constructor() {
        this.loader = new Loader('https://course-api.com/react-store-products');
        this.view = new Products();
        this.filters = null;
    }
    start() {
        return this.loader.getResp().then((data) => {
            if (data) {
                app.view.drawCategory().deleteDoubleCategory().draw(data);
            }
            this.setFilters();
        });
    }
    setFilters(): void {
        this.filters = new Filters(this.loader.dataArray);
        this.filters.loadHandler();
        this.filters.searchControlHandler();
        this.filters.filterSearch();
        this.filters.sortHandler();
        this.filters.filterCategory();
        this.filters.filterCompany();
        this.filters.filterColor();
        this.filters.filetrPrice();
        this.filters.clearFilter();
        this.filters.showMethods(this.filters.allData);
    }
}

let app = new App();
app.start();
