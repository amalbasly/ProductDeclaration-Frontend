import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-prep-dashboard',
  standalone: false,
  templateUrl: './prep-dashboard.component.html',
  styleUrls: ['./prep-dashboard.component.scss']
})
export class PrepDashboardComponent implements OnInit {
  metrics = [
    { title: 'Total PCBs', value: '1,245', subtext: '+5% from last month' },
    { title: 'Serialized PCBs', value: '780', subtext: '65% of total' },
    { title: 'Non-Serialized PCBs', value: '465', subtext: '35% of total' },
    { title: 'Gallia/Etiquette Labels', value: '2,100', subtext: 'Applied this week' },
    { title: 'Flan Decoupage', value: '890', subtext: 'Completed units' },
    { title: 'Assemblage Units', value: '1,050', subtext: 'Combined products' },
  ];

  actions = [
    { title: 'Review Pending PCB Orders', buttonText: 'View', color: 'primary' },
    { title: 'Update PCB Inventory', buttonText: 'Edit', color: 'accent' },
    { title: 'Generate Quality Report', buttonText: 'Download', color: 'primary' },
    { title: 'Schedule Assemblage Batch', buttonText: 'Plan', color: 'warn' },
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    const productionCtx = document.getElementById('productionChart') as HTMLCanvasElement;
    new Chart(productionCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'PCBs Produced',
          data: [200, 250, 300, 280, 320, 350],
          borderColor: '#0b6985', // all-blue
          backgroundColor: 'rgba(11, 105, 133, 0.2)', // Transparent all-blue
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Units Produced' } },
          x: { title: { display: true, text: 'Month' } },
        },
      },
    });

    const typeCtx = document.getElementById('typeChart') as HTMLCanvasElement;
    new Chart(typeCtx, {
      type: 'doughnut',
      data: {
        labels: ['Serialized', 'Non-Serialized', 'High-Density', 'Flexible'],
        datasets: [{
          data: [780, 465, 150, 100],
          backgroundColor: ['#0b6985', '#FF4757', '#1e293b', '#edf2f7'], // Palette colors
          borderWidth: 1,
          borderColor: '#ffffff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'Lato', size: 14 } } } },
      },
    });
  }
}