import { Component, OnInit, ViewChild } from '@angular/core';
import { Marker } from '../../classes/marker.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import { EditMapComponent } from './edit-map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  infoWindowOpened = null;
  previousInfoWindow = null;
  markers: Marker[] = [];
  protected map: any;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    if (localStorage.getItem('markers')) {
      this.markers = JSON.parse(localStorage.getItem('markers'));
    }
  }

  ngOnInit(): void {}

  placeMarker($event: any) {
    this.close_window();
    const newMarker = new Marker($event.coords.lat, $event.coords.lng);
    this.markers.push(newMarker);

    this.saveToLocalStorage();
    this.snackBar.open('Marker added', 'Close', {duration: 1000});
  }

  deleteMarker(i: number) {
    this.close_window();
    this.markers.splice(i, 1);

    this.saveToLocalStorage();
    this.snackBar.open('Marker removed', 'Close', {duration: 1000});
  }

  editMarker(marker: Marker){
    const dialogRef = this.dialog.open(EditMapComponent, {
      data: {title: marker.title, dsc: marker.dsc}
    });

    dialogRef.afterClosed().subscribe(result => {
      marker.dsc = result.dsc;
      marker.title = result.title;

      this.saveToLocalStorage();
    });
    this.close_window();
  }

  select_marker(data, infoWindow) {
    if (this.previousInfoWindow == null) {
      this.previousInfoWindow = infoWindow;
    } else {
      this.infoWindowOpened = infoWindow;
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infoWindow;
  }

  mapReady(map) {
    this.map = map;
    if (this.map && this.markers) {
      const last = this.markers.length - 1;
      this.map.setCenter({ lat: this.markers[last].lat, lng: this.markers[last].lng });
    }
  }

  private close_window() {
    if (this.previousInfoWindow != null) {
      this.previousInfoWindow.close();
      this.previousInfoWindow = null;
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('markers', JSON.stringify(this.markers));
  }


}
