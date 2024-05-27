import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  usersProfile: any[] = [];
  Image: any;
  profileForm: any;
  selectedUser: any;
  tags: string[] = [];
  profileImageUrl: string | ArrayBuffer | null = 'assets/icon/profile.png';
  @ViewChild('content') content: TemplateRef<any> | undefined;
  countryList = ['India', 'USA', 'UK']; // Example countries
  states = ['Maharashtra', 'California', 'London']; // Example states 
  constructor(private apiService: ApiService, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getUserData();
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      age: [''],
      country: [''],
      state: [''],
      address: [''],
      tags: [''],
      subscribe: [false],
      id: [0]
    });
  }

  openModal(user: any): void {
    this.selectedUser = user;
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      country: user.country,
      state: user.state,
      address: user.address,
      tags: user.tags.join(', '),
      subscribe: user.subscribe,
      id: user.id
    });
    this.modalService.open(this.content);
  }

  onSubmit(): void {
    console.log(this.profileForm.value);
    this.apiService.updateData(this.profileForm.value).subscribe((data: any) => {
      this.toastr.success('Update Sucessfully.')
    })
  }

  addTags(event: any): void {
    if (event.target.value) {
      this.tags.push(event.target.value);
      event.target.value = '';
    }
  }

  deleteTag(index: number): void {
    this.tags.splice(index, 1);
  }
  getUserData() {
    this.apiService.getUsers().subscribe(
      (data) => {
        this.usersProfile = data;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 310;
          const MAX_HEIGHT = 325;
          if (img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT) {
            this.profileImageUrl = e.target.result;
          } else {
            this.toastr.error('Image size exceeds the maximum dimensions of 310x325 pixels.');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadImage(file);
    } else {
      this.toastr.error('Selected file is not an image.');
    }
  }

  uploadImage(file: File) {
    debugger;
    localStorage.setItem('profileImg', file.name);
    const formData = new FormData();
    formData.append('image', file);

    this.apiService.addProfileImage(formData).subscribe(
      (response) => {
        // Response should contain the URL of the uploaded image
        this.profileImageUrl = response.imageUrl;
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }
}
