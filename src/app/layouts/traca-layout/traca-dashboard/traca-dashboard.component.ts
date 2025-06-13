import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables, TooltipItem } from 'chart.js';

interface ApprovalStats {
  approved: number;
  pending: number;
  rejected: number;
  completed: number;
  approvalRate: number;
  avgPendingDuration: number;
  rejectionTrend: number;
  completionGoal: number;
}

interface RecentRequest {
  productId: string;
  productName: string;
  requester: string;
  submissionDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority?: 'high' | 'medium' | 'low';
}

interface RecentActivity {
  type: 'approval' | 'rejection' | 'update' | 'system';
  icon: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-traca-dashboard',
  standalone : false,
  templateUrl: './traca-dashboard.component.html',
  styleUrls: ['./traca-dashboard.component.scss']
})
export class TracaDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('approvalStatusChart') approvalStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('complianceTrendChart') complianceTrendChartRef!: ElementRef<HTMLCanvasElement>;

  currentDate = new Date();
  timeFilter = 'month';
  requestFilter = 'all';
  trendPeriod = 'Last 30 Days';

  // Summary card data
  pendingCount = 15;
  approvedToday = 8;
  rejectedCount = 3;
  totalProducts = 142;

  // Enhanced approval statistics
  approvalStats: ApprovalStats = {
    approved: 42,
    pending: 15,
    rejected: 8,
    completed: 35,
    approvalRate: 65,
    avgPendingDuration: 2.5,
    rejectionTrend: -3,
    completionGoal: 75
  };

  // Recent approval requests
  recentRequests: RecentRequest[] = [
    {
      productId: 'PRD-2023-001',
      productName: 'Gallia Product A',
      requester: 'John Smith',
      submissionDate: new Date('2023-05-15'),
      status: 'pending',
      priority: 'high'
    },
    {
      productId: 'PRD-2023-002',
      productName: 'Serialized Flan B',
      requester: 'Sarah Johnson',
      submissionDate: new Date('2023-05-14'),
      status: 'approved',
      priority: 'medium'
    },
    {
      productId: 'PRD-2023-003',
      productName: 'Assembly Kit C',
      requester: 'Mike Brown',
      submissionDate: new Date('2023-05-14'),
      status: 'rejected'
    },
    {
      productId: 'PRD-2023-004',
      productName: 'Non-Serialized Product D',
      requester: 'Emma Wilson',
      submissionDate: new Date('2023-05-13'),
      status: 'pending',
      priority: 'high'
    }
  ];

  filteredRequests = this.recentRequests;

  // Recent activities
  recentActivities: RecentActivity[] = [
    {
      type: 'approval',
      icon: 'fa-check-circle',
      message: 'Approved product PRD-2023-002',
      timestamp: new Date('2023-05-15T10:30:00')
    },
    {
      type: 'rejection',
      icon: 'fa-times-circle',
      message: 'Rejected product PRD-2023-003',
      timestamp: new Date('2023-05-15T09:45:00')
    },
    {
      type: 'update',
      icon: 'fa-sync-alt',
      message: 'Updated traceability settings',
      timestamp: new Date('2023-05-14T16:20:00')
    },
    {
      type: 'system',
      icon: 'fa-bell',
      message: 'New products awaiting approval',
      timestamp: new Date('2023-05-14T08:15:00')
    }
  ];

  private approvalStatusChart!: Chart<'doughnut'>;
  private complianceTrendChart!: Chart<'line'>;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initial setup, but chart initialization moved to ngAfterViewInit
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  initCharts(): void {
    if (this.approvalStatusChartRef?.nativeElement) {
      this.initApprovalStatusChart();
    } else {
      console.warn('Approval Status Chart canvas not available');
    }
    if (this.complianceTrendChartRef?.nativeElement) {
      this.initComplianceTrendChart();
    } else {
      console.warn('Compliance Trend Chart canvas not available');
    }
  }

  initApprovalStatusChart(): void {
    const ctx = this.approvalStatusChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for Approval Status Chart');
      return;
    }
    this.approvalStatusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending', 'Rejected', 'Completed'],
        datasets: [{
          data: [
            this.approvalStats.approved,
            this.approvalStats.pending,
            this.approvalStats.rejected,
            this.approvalStats.completed
          ],
          backgroundColor: ['#0b6985', '#ffc107', '#FF4757', '#28a745'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'doughnut'>) => {
                const value = context.raw as number;
                const total = this.approvalStats.approved + this.approvalStats.pending +
                              this.approvalStats.rejected + this.approvalStats.completed;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }

  initComplianceTrendChart(): void {
    const ctx = this.complianceTrendChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context for Compliance Trend Chart');
      return;
    }
    this.complianceTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Approval Rate',
            data: [85, 82, 88, 90],
            borderColor: '#0b6985',
            backgroundColor: 'rgba(11, 105, 133, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Rejection Rate',
            data: [12, 15, 9, 7],
            borderColor: '#FF4757',
            backgroundColor: 'rgba(255, 71, 87, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: false, min: 0, max: 100 } }
      }
    });
  }

  filterByTime(period: string): void {
    this.timeFilter = period;
    // Simulated data update based on time period
    if (period === 'week') {
      this.approvalStats = {
        approved: 10,
        pending: 5,
        rejected: 2,
        completed: 8,
        approvalRate: 59,
        avgPendingDuration: 1.8,
        rejectionTrend: -1,
        completionGoal: 75
      };
    } else if (period === 'month') {
      this.approvalStats = {
        approved: 42,
        pending: 15,
        rejected: 8,
        completed: 35,
        approvalRate: 65,
        avgPendingDuration: 2.5,
        rejectionTrend: -3,
        completionGoal: 75
      };
    } else if (period === 'quarter') {
      this.approvalStats = {
        approved: 120,
        pending: 45,
        rejected: 20,
        completed: 90,
        approvalRate: 62,
        avgPendingDuration: 3.2,
        rejectionTrend: -5,
        completionGoal: 75
      };
    }
    if (this.approvalStatusChart) {
      this.approvalStatusChart.data.datasets[0].data = [
        this.approvalStats.approved,
        this.approvalStats.pending,
        this.approvalStats.rejected,
        this.approvalStats.completed
      ];
      this.approvalStatusChart.update();
    } else {
      console.warn('Approval Status Chart not initialized for update');
    }
    console.log(`Filtering by ${period}`);
  }

  filterRequests(): void {
    if (this.requestFilter === 'all') {
      this.filteredRequests = this.recentRequests;
    } else if (this.requestFilter === 'pending') {
      this.filteredRequests = this.recentRequests.filter(r => r.status === 'pending');
    } else if (this.requestFilter === 'urgent') {
      this.filteredRequests = this.recentRequests.filter(r => r.priority === 'high');
    }
  }

  previousPeriod(): void {
    // Implement logic to show previous period data
    console.log('Previous period');
  }

  nextPeriod(): void {
    // Implement logic to show next period data
    console.log('Next period');
  }

  refreshData(): void {
    // Implement data refresh logic
    console.log('Refreshing data');
    this.initCharts();
  }

  viewAllActivities(): void {
    // Implement view all activities logic
    console.log('View all activities');
  }

  reviewRequest(request: RecentRequest): void {
    // Implement review request logic
    console.log('Reviewing request:', request);
  }
}