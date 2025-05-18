import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-prep-dashboard',
  standalone: false,
  templateUrl: './prep-dashboard.component.html',
  styleUrls: ['./prep-dashboard.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('chartAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.7s ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PrepDashboardComponent implements OnInit {
  // Metrics and actions as provided
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
          borderColor: '#166a33',
          backgroundColor: 'rgba(22, 106, 51, 0.1)',
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
          backgroundColor: ['#166a33', '#b87333', '#1e293b', '#e63946'],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }
}