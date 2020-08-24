export class Marker {
    public lat: number;
    public lng: number;
    public title = 'N/A';
    public dsc = 'N/A';

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }
}