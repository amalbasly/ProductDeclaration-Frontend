import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../Services/profile.service';
import { ValidateEmployeeService, User } from '../../../Services/validate-employee.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  profileImageUrl: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private validateService: ValidateEmployeeService
  ) {
    this.profileForm = this.fb.group({
      pl_nom: ['', Validators.required],
      pl_prenom: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.validateService.getCurrentUser();
    console.log('🔐 Current user from service:', this.currentUser);

    if (!this.currentUser || !this.currentUser.pl_matric) {
      this.errorMessage = 'Utilisateur non connecté ou matricule manquant';
      console.error('❌ currentUser is invalid:', this.currentUser);
      return;
    }

    this.loadProfileData(this.currentUser.pl_matric);
  }

  loadProfileData(pl_matric: number): void {
    this.isLoading = true;
    this.profileService.getProfile(pl_matric).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          pl_nom: data.pl_nom,
          pl_prenom: data.pl_prenom
        });
        if (data.img) {
          this.profileImageUrl = `assets/profile-images/${data.img}`;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile data';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentUser || !this.currentUser.pl_matric) {
      this.errorMessage = 'User not logged in or missing matricule';
      return;
    }

    const { pl_nom, pl_prenom } = this.profileForm.value;

    if (!pl_nom || !pl_prenom) {
      this.errorMessage = 'Name and surname are required';
      return;
    }

    this.isLoading = true;

    this.profileService.updateProfile(
      this.currentUser.pl_matric,
      pl_nom,
      pl_prenom,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Update profile error:', err);
        this.errorMessage = 'Error updating profile';
        this.isLoading = false;
      }
    });
  }
}