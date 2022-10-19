import { ResResult, ResponseArray, Callback } from '../../models/Types';
class Loader {
    public dataArray: ResponseArray | undefined;
    constructor(public baseLink: string) {}
    errorHandler(res: Response): Response | undefined {
        if (!res) return undefined;
        if (!res.ok) {
            if (res.status === ResResult.Unauthorized || res.status === ResResult.NotFound)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }
        return res;
    }
    getResp(): Promise<ResponseArray | void> {
        return fetch(this.baseLink)
            .then((res) => res?.json())
            .then((data: ResponseArray | undefined) => {
                this.dataArray = data;
                return data;
            })
            .catch((err) => console.error(err));
    }
}

export default Loader;
