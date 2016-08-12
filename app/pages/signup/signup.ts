import { Component, OnInit } from '@angular/core';
import { Modal, NavController, ViewController, LoadingController, ToastController } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { IThread, UserCredentials } from '../../shared/interfaces';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { CheckedValidator } from '../../shared/validators/checked.validator';

@Component({
    templateUrl: 'build/pages/signup/signup.html',
    directives: [FORM_DIRECTIVES]
})
export class SignupPage implements OnInit {

    createFirebaseAccountForm: FormGroup;
    username: AbstractControl;
    email: AbstractControl;
    password: AbstractControl;
    dateOfBirth: AbstractControl;
    terms: AbstractControl;

    constructor(private nav: NavController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private viewCtrl: ViewController,
        private fb: FormBuilder,
        private dataService: DataService,
        private authService: AuthService) { }

    ngOnInit() {
        this.createFirebaseAccountForm = this.fb.group({
            'username': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            'email': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            'dateOfBirth': [new Date().toISOString().slice(0, 10), Validators.compose([Validators.required])],
            'terms': [false, CheckedValidator.isChecked]
        });

        this.username = this.createFirebaseAccountForm.controls['username'];
        this.email = this.createFirebaseAccountForm.controls['email'];
        this.password = this.createFirebaseAccountForm.controls['password'];
        this.dateOfBirth = this.createFirebaseAccountForm.controls['dateOfBirth'];
        this.terms = this.createFirebaseAccountForm.controls['terms'];
    }

    getFormattedDate(): string {
        let now = new Date();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();

        let formattedDate = [now.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('-');
        console.log(formattedDate);
        return formattedDate;
    }

    onSubmit(signupForm: any): void {
        var self = this;

        if (this.createFirebaseAccountForm.valid) {

            let loader = this.loadingCtrl.create({
                content: 'Creating account...',
                dismissOnPageChange: true
            });

            let newUser: UserCredentials = {
                email: signupForm.email,
                password: signupForm.password
            };

            loader.present();

            console.log(newUser);
            this.authService.registerUser(newUser)
                .then(function (result) {
                    console.log(self.authService.getLoggedInUser());
                    self.authService.addUser(signupForm.username, signupForm.dateOfBirth, self.authService.getLoggedInUser().uid);
                    loader.dismiss()
                        .then(() => {
                            self.viewCtrl.dismiss({
                                user: newUser
                            }).then(() => {
                                let toast = self.toastCtrl.create({
                                    message: 'Account created successfully',
                                    duration: 4000,
                                    position: 'top'
                                });
                                toast.present();
                            });
                        });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error(error);
                    loader.dismiss().then(() => {
                        let toast = self.toastCtrl.create({
                            message: errorMessage,
                            duration: 4000,
                            position: 'top'
                        });
                        toast.present();
                    });
                });
        }
    }

}