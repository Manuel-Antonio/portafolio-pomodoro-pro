export class Theme {
    id: number = 0; 
    color?:string = "";

    constructor(id: number, color:string) {
        this.id = id;
        this.color = color;
    }
}
