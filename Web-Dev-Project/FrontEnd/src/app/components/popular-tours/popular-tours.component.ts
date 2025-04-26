import { Component, OnInit } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-popular-tours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-tours.component.html',
  styleUrls: ['./popular-tours.component.css']
})
export class PopularToursComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.tourService.getActiveTours().subscribe((data) => {
      this.tours = data.slice(0, 3); // Show only top 3 for "Popular"
    });
  }
}
