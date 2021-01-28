import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import Swiper from 'swiper';
interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: 'app-create-new-test',
  templateUrl: './create-new-test.component.html',
  styleUrls: ['./create-new-test.component.css']
})
export class CreateNewTestComponent implements OnInit {
  mySwiper: any = null;
  titleArray: any =
    {
      title: "Screening Center",
      subTitle: "",
      img: "/assets/images/ui/Icons/tube.png"
    };
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Test Strip' },
    { viewValue: 'Reagent' }
  ];
  term: any;
  listOfTestRecords = [
    {
      "id": "123",
      "testname": "Urine Routine",
      "devicemodel": "UTSR",
      "testmethod": "Test Strip",
      "brand": "ASK Inc.",
      "identificationNo": "TS-123456789",
      "Action": "8",
    }
  ]
  closeResult: string;
  addTestDateDetails: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  viewTestInfoForm: FormGroup;
  patientProfileForm: FormGroup;
  patients: any = [];
  patientsList: any = [];
  filteredPatients: any = [];
  options: Array<any>;
  signInRes: any;
  signObj: any;
  byWhom: string;
  byWhomID: string;
  hospitalRegNum: string;
  selectedRow: any;
  selectedDevice: any;
  imgURL: any = "http://34.231.177.197:3000"
  baseURL: string = "http://34.231.177.197:3000";
  fetchedDevicesData: any = []
  //[{
  //   "id": 1,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc"
  // }, {
  //   "id": 2,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc2"
  // }, {
  //   "id": 3,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc3"
  // },
  // {
  //   "id": 4,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc4"
  // }, {
  //   "id": 5,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc5"
  // }, {
  //   "id": 6,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc6"
  // },
  // {
  //   "id": 7,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc7"
  // }, {
  //   "id": 8,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc8"
  // }, {
  //   "id": 9,
  //   "img": "../../../../assets/images/ui/Icons/Capture.png",
  //   "name": "abc9"
  // }]
  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder,
    private loginService: LoginService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);
    this.byWhom = "medical personnel";
    this.byWhomID = this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id;
    this.hospitalRegNum = this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num;

    let objForFetchPatients = {
      "byWhom": this.byWhom,
      "byWhomID": this.byWhomID,
      "category": "all",
      "hospital_reg_num": this.hospitalRegNum,
      "token": this.signObj.access_token
    }
    this.getPatientData(objForFetchPatients);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.addTestDateDetails = this._formBuilder.group({
      startDate: [""],
      endDate: [""]
    })
    this.viewTestInfoForm = this._formBuilder.group({
      testName: [""],
      testDevice: [""],
      testMethod: [""],
      testItems: [""]
    })
    this.patientProfileForm = this._formBuilder.group({
      doctorName: [""],
      department: [""],
      medical_personnel_id: [""],
      firstName: [""],
      lastName: [""],
      gender: [""],
      dob: [""],
      phoneNumberCountryCode: [""],
      phoneNumber: [""],
      age: [""],
      emailID: [""],
      address: [""],
      city: [""],
      state: [""],
      country: [""],
      postalCode: [""],
      profilePic: [""],
    });

    this.onLoad();
  }

  onLoad() {
    this.fetchedDevicesData = [{
      "id": 11,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR1"
    }, {
      "id": 2,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR2"
    }, {
      "id": 3,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR3"
    },
    {
      "id": 4,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR4"
    }, {
      "id": 5,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR5"
    }, {
      "id": 6,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR6"
    },
    {
      "id": 7,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR7"
    }, {
      "id": 8,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR8"
    }, {
      "id": 9,
      "img": "../../../../assets/images/ui/Icons/Capture.png",
      "name": "UTSR9"
    }];
    //this.cd.detectChanges();
    this.initiateSwiper();

  }

  onTabChange(event) {
    console.log("event", event)
  }
  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
    }
  }
  search(term: string) {
    console.log("term", term)
    // if (!term) {
    //   this.filteredPatients = this.patientsList;
    // } else {
    //   this.filteredPatients = this.patientsList.filter(x =>
    //     x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
    //   );
    // }
  }

  getPatientData(obj) {
    console.info("fetching patients data : ", obj);
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {

          this.patientsList = res.patients;
          this.filteredPatients = res.patients;
          // this.cd.detectChanges();
          // this.initiateSwiper();
          console.log("list of patients : ", this.patientsList);
          this.options = this.patientsList;
        } else {
          console.log(res.message);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {

          console.log("Client Side Error")
        } else {

          console.log(err)
        }
      })

    // this.initiateSwiper()

  }
  findPatient(term: string) {
    this.patients;
    this.filteredPatients;
    if (!term) {
      this.patients = this.filteredPatients;
    } else {
      this.patients = this.filteredPatients.filter(x =>
        x.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }
  selectPatientFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.filteredPatients.findIndex((val) => {
      return (
        val.patientID ===
        value.patientID
      );
    });
    if (index != -1) {
      let obj = this.filteredPatients[index];
      console.log("index val...", obj)
      this.selectedRow = this.filteredPatients[index].patientID;
      console.log("obj", obj);
      this.patientProfileForm.patchValue({
        doctorName:
          obj.firstName +
          " " +
          obj.lastName,
        medical_personnel_id: obj.medical_personnel_id,
        department: obj.department,
      });
      //this.modalService.dismissAll()
    }
  }
  selectDeviceFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.fetchedDevicesData.findIndex((val) => {
      return (
        val.id ===
        value.id
      );
    });
    if (index != -1) {
      let obj = this.fetchedDevicesData[index];
      console.log("index val...", obj)
      this.selectedDevice = this.fetchedDevicesData[index].id;
      console.log("obj", obj);
      // this.patientProfileForm.patchValue({
      //   doctorName:
      //     obj.firstName +
      //     " " +
      //     obj.lastName,
      //   medical_personnel_id: obj.medical_personnel_id,
      //   department: obj.department,
      // });
      //this.modalService.dismissAll()
    }
  }
  openDeleteTestMethod(viewDeleteTestModelContent, patient) {
    // this.isButton = false;
    this.modalService.open(viewDeleteTestModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openViewTestReportMethod(viewTestReportModelContent, patient) {
    this.modalService.open(viewTestReportModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openAddCommentMethod(openAddCommentModelContent, patient) {
    this.modalService.open(openAddCommentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openCreateNewTestMethod(createNewTestModel, patientsList) {
    this.modalService.open(createNewTestModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  initiateSwiper() {
    this.mySwiper = new Swiper('.s1', {
      slidesPerView: 3,
      spaceBetween: 10,
      // init: false,

      loop: true,
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      }
      // And if we need scrollbar
    })


  }

}
