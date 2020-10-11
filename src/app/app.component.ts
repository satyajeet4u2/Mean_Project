import {Component, OnInit} from '@angular/core';
import {PostModel} from './posts/post.model';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MeanProject2';
  // storedPost: PostModel[] = [];
constructor(private authService: AuthService) {}
  // onPostAdded(post: PostModel) {
  //   this.storedPost.push(post);
  // }
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
