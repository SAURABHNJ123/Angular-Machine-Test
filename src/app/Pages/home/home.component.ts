import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr'; // Ensure the correct path
import { Profile } from 'src/app/Model/profile';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/Images/pexels-andrew-8960464.jpg',
    'assets/Images/pexels-cup-of-couple-6177609.jpg',
    'assets/Images/pexels-daan-stevens-66128-939331.jpg',
    'assets/Images/pexels-tranmautritam-245032.jpg'
  ];
  aboutText = 'Find out more about us';
  profileForm: any;
  profileImageUrl: string | ArrayBuffer | null = 'assets/icon/profile.png';
  tags: string[] = [];
  selectedCountry: string | undefined;
  selectedState: string | undefined;
  states: string[] = [];
  countryList: string[] = ['India', 'USA', 'Germany'];
  tagLimitReached: boolean = false;


  @ViewChild('fileInput') fileInput: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: ApiService,
    private route: Router
  ) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      profileImage: [null, [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(20),Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      age: [20, Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', [Validators.required]],
      tags: [''],
      subscribe: [false]
    });
  }

  onImageClick() {
    this.fileInput.nativeElement.click();
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

  selectCountry(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    this.selectedCountry = selectedCountry;
    this.updateStates(selectedCountry);
    this.profileForm.get('state').reset();
  }


  selectState(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;
    this.selectedState = selectedState;
    this.profileForm.patchValue({ selectedState });
  }

  updateStates(country: string) {
    const stateMap: { [key: string]: string[] } = {
      India: ['Maharashtra', 'Delhi', 'Kerala'],
      USA: ['Alabama', 'Alaska', 'California'],
      Germany: ['Bavaria', 'Saxony', 'Thuringia']
    };
    this.states = stateMap[country] || [];
  }

  setAge(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profileForm.patchValue({ age: input.value });
  }

  addTags(event: Event) {
    event.preventDefault();
    const tag = this.profileForm.get('tags').value;
    if (tag) {
      if (this.tags.length < 3) {
        this.tags.push(tag);
        this.profileForm.get('tags').setValue('');
        this.tagLimitReached = false;
      } else {
        this.tagLimitReached = true;
      }
    }
  }

  deleteTag(index: number) {
    this.tags.splice(index, 1);
  }

  openLg(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const profileData: Profile = { ...this.profileForm.value, tags: this.tags };
      console.log("profileData == ", profileData)
      this.apiService.addProfileData(profileData).subscribe(
        () => {
          this.toastr.success('Registered Successfully'),
            this.profileForm.reset();
          this.route.navigate(['/profile']);
        },
        error => this.toastr.error('Error registering profile', error)
      );
    } else {
      this.toastr.error('Form is invalid');
    }
  }
}
