import { Component, OnInit } from '@angular/core';
import { Modal, NavController, ViewController, LoadingController, ToastController } from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { IThread, UserCredentials } from '../../shared/interfaces';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    templateUrl: 'build/pages/login/login.html',
    directives: [FORM_DIRECTIVES]
})
export class LoginPage implements OnInit {

    loginFirebaseAccountForm: FormGroup;
    email: AbstractControl;
    password: AbstractControl;

    constructor(private nav: NavController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private fb: FormBuilder,
        private dataService: DataService,
        private authService: AuthService) { }

    ngOnInit() {
        console.log('in user login..');
        this.loginFirebaseAccountForm = this.fb.group({
            'email': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])]
        });

        this.email = this.loginFirebaseAccountForm.controls['email'];
        this.password = this.loginFirebaseAccountForm.controls['password'];
    }

    onSubmit(signInForm: any): void {
        var self = this;
        if (this.loginFirebaseAccountForm.valid) {

            let loader = this.loadingCtrl.create({
                content: 'Signing in firebase..',
                dismissOnPageChange: true
            });

            loader.present();

            let user: UserCredentials = {
                email: signInForm.email,
                password: signInForm.password
            };

            console.log(user);
            this.authService.signInUser(user.email, user.password)
                .then(function (result) {
                    console.log(self.authService.getLoggedInUser());
                    self.nav.setRoot(TabsPage);
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