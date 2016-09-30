import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ForumApp } from './app.component';
// Pages
import { AboutPage } from '../pages/about/about';
import { CommentCreatePage } from '../pages/comment-create/comment-create';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { ThreadCommentsPage } from '../pages/thread-comments/thread-comments';
import { ThreadCreatePage } from '../pages/thread-create/thread-create';
import { ThreadsPage } from '../pages/threads/threads';
// Custom components
import { ThreadComponent } from '../shared/components/thread.component';
import { UserAvatarComponent } from '../shared/components/user-avatar.component';
// providers
import { APP_PROVIDERS } from '../providers/app.providers';

@NgModule({
  declarations: [
    ForumApp,
    AboutPage,
    CommentCreatePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    TabsPage,
    ThreadCommentsPage,
    ThreadCreatePage,
    ThreadsPage,
    ThreadComponent,
    UserAvatarComponent
  ],
  imports: [
    IonicModule.forRoot(ForumApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ForumApp,
    AboutPage,
    CommentCreatePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    TabsPage,
    ThreadCommentsPage,
    ThreadCreatePage,
    ThreadsPage
  ],
  providers: [APP_PROVIDERS]
})
export class AppModule {}
