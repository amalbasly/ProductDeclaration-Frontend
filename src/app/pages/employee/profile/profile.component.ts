import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../Services/profile.service';
import { ValidateEmployeeService, User } from '../../../Services/validate-employee.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  profileImageUrl: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  imageError: string | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private validateService: ValidateEmployeeService
  ) {
    this.profileForm = this.fb.group({
      pl_nom: ['', Validators.required],
      pl_prenom: ['', Validators.required],
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
          pl_prenom: data.pl_prenom,
        });
        if (data.img) {
          this.profileImageUrl = `assets/profile-images/${data.img}`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des données du profil';
        console.error('❌ Load profile error:', err);
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        this.imageError = 'Veuillez sélectionner une image valide (JPEG, PNG, GIF)';
        this.selectedFile = null;
        this.profileImageUrl = this.currentUser?.profileImage ? `assets/profile-images/${this.currentUser.profileImage}` : '';
        return;
      }

      if (file.size > maxSize) {
        this.imageError = 'La taille de l\'image doit être inférieure à 5 Mo';
        this.selectedFile = null;
        this.profileImageUrl = this.currentUser?.profileImage ? `assets/profile-images/${this.currentUser.profileImage}` : '';
        return;
      }

      this.imageError = null;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.profileImageUrl = this.currentUser?.profileImage ? `assets/profile-images/${this.currentUser.profileImage}` : '';
    this.imageError = null;
  }

  resetForm(): void {
    this.profileForm.reset();
    this.selectedFile = null;
    this.profileImageUrl = this.currentUser?.profileImage ? `assets/profile-images/${this.currentUser.profileImage}` : '';
    this.imageError = null;
    this.successMessage = '';
    this.errorMessage = '';
    if (this.currentUser?.pl_matric) {
      this.loadProfileData(this.currentUser.pl_matric);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.isLoading) return;

    if (!this.currentUser || !this.currentUser.pl_matric) {
      this.errorMessage = 'Utilisateur non connecté ou matricule manquant';
      return;
    }

    const confirmUpdate = confirm('Êtes-vous sûr de vouloir mettre à jour votre profil ?');
    if (!confirmUpdate) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { pl_nom, pl_prenom } = this.profileForm.value;

    this.profileService.updateProfile(
      this.currentUser.pl_matric,
      pl_nom,
      pl_prenom,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.successMessage = 'Profil mis à jour avec succès !';
        this.isLoading = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Update profile error:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      },
    });
  }
}