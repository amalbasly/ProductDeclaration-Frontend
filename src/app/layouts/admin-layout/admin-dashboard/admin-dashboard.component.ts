import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone : false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('performanceChart', { static: false }) performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userDistributionChart', { static: false }) userDistributionChartRef!: ElementRef<HTMLCanvasElement>;

  currentDate = new Date();
  isLoading = false;
  errorMessage: string | null = null;

  // Sample data for metrics, quick actions, activities, and users
  metrics = [
    { title: 'Active Users', value: '142', subtext: 'Currently online', icon: 'fa-users', color: 'primary', trend: 'up' },
    { title: 'System Uptime', value: '99.8%', subtext: 'Last 30 days', icon: 'fa-clock', color: 'success', trend: 'up' },
    { title: 'Pending Tasks', value: '23', subtext: 'Awaiting review', icon: 'fa-tasks', color: 'warn', trend: 'down' },
    { title: 'Server Load', value: '68%', subtext: 'Current capacity', icon: 'fa-server', color: 'accent', trend: 'up' }
  ];

  quickActions = [
    { title: 'Add User', icon: 'fa-user-plus', action: 'addUser' },
    { title: 'New Report', icon: 'fa-file-alt', action: 'newReport' },
    { title: 'System Check', icon: 'fa-cogs', action: 'systemCheck' },
    { title: 'Send Alert', icon: 'fa-bell', action: 'sendAlert' }
  ];

  activities = [
    { message: 'John Doe updated user permissions', icon: 'fa-user-cog', color: 'primary', timestamp: new Date(Date.now() - 3600000) },
    { message: 'System backup completed successfully', icon: 'fa-database', color: 'success', timestamp: new Date(Date.now() - 7200000) },
    { message: 'Server load spiked to 85%', icon: 'fa-exclamation-triangle', color: 'warn', timestamp: new Date(Date.now() - 10800000) },
    { message: 'New user registered: Jane Smith', icon: 'fa-user-plus', color: 'info', timestamp: new Date(Date.now() - 14400000) }
  ];

  recentUsers = [
    { name: 'John Doe', role: 'Admin', department: 'IT', avatar: 'https://i.pravatar.cc/48?u=john', status: 'active' },
    { name: 'Jane Smith', role: 'Manager', department: 'Operations', avatar: 'https://i.pravatar.cc/48?u=jane', status: 'inactive' },
    { name: 'Mike Johnson', role: 'Staff', department: 'Support', avatar: 'https://i.pravatar.cc/48?u=mike', status: 'active' },
    { name: 'Sarah Williams', role: 'Contractor', department: 'Dev', avatar: 'https://i.pravatar.cc/48?u=sarah', status: 'on-leave' }
  ];

  private performanceChart: Chart | null = null;
  private userDistributionChart: Chart | null = null;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initialization that doesn't need DOM elements
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initCharts(): void {
    // Destroy existing charts first
    this.destroyCharts();

    // Initialize Performance Chart
    if (this.performanceChartRef?.nativeElement) {
      try {
        const ctx = this.performanceChartRef.nativeElement.getContext('2d');
        if (ctx) {
          this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [
                {
                  label: 'System Load',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  borderColor: '#3f51b5',
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  tension: 0.3,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Load (%)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Month'
                  }
                }
              }
            }
          });
        }
      } catch (e) {
        console.error('Error initializing performance chart:', e);
        this.errorMessage = 'Failed to load performance chart';
      }
    }

    // Initialize User Distribution Chart
    if (this.userDistributionChartRef?.nativeElement) {
      try {
        const ctx = this.userDistributionChartRef.nativeElement.getContext('2d');
        if (ctx) {
          this.userDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Administrators', 'Managers', 'Staff', 'Contractors'],
              datasets: [{
                data: [15, 30, 120, 25],
                backgroundColor: [
                  '#3f51b5',
                  '#ff4081',
                  '#4caf50',
                  '#ff9800'
                ],
                borderWidth: 0
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((value as number) / total * 100).toFixed(1);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
      } catch (e) {
        console.error('Error initializing user distribution chart:', e);
        this.errorMessage = 'Failed to load user distribution chart';
      }
    }
  }

  private destroyCharts(): void {
    if (this.performanceChart) {
      this.performanceChart.destroy();
      this.performanceChart = null;
    }
    if (this.userDistributionChart) {
      this.userDistributionChart.destroy();
      this.userDistributionChart = null;
    }
  }

  refresh(): void {
    this.isLoading = true;
    this.errorMessage = null;
    setTimeout(() => {
      this.isLoading = false;
      this.initCharts();
    }, 1500);
  }

  getFormattedDate(): string {
    return this.currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  executeAction(action: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      switch (action) {
        case 'addUser':
          alert('Action: Adding a new user...');
          break;
        case 'newReport':
          alert('Action: Generating a new report...');
          break;
        case 'systemCheck':
          alert('Action: Running system check...');
          break;
        case 'sendAlert':
          alert('Action: Sending alert to users...');
          break;
        default:
          this.errorMessage = 'Unknown action: ' + action;
      }
    }, 1000);
  }
}