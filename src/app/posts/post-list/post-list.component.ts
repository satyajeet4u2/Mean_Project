import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostModel} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {MatDialog} from '@angular/material';
import {CommonDialogConfirmationComponent} from '../../common component/common-dialog-confirmation/common-dialog-confirmation.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: 'Post 1', content: 'This is Content1'},
  //   {title: 'Post 2', content: 'This is Content2'},
  //   {title: 'Post 3', content: 'This is Content3'},
  //   {title: 'Post 4', content: 'This is Content4'}
  // ];
  // @Input() posts: PostModel[] = [];
  posts: PostModel[] = [];
  private postSubscription: Subscription;
  private authListnerSubscription: Subscription;
  isLoading = false;
  isAuthenticated = false;
  userId: string;

  constructor(public postService: PostService,
              private authService: AuthService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPost();
    this.userId = this.authService.getUserId();
    this.postSubscription = this.postService.getPostUpdateListener().subscribe((post: PostModel[]) => {
      this.posts = post;
      this.isLoading = false;
    });
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authListnerSubscription = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });

  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }

  deletePost(id: string) {
    const dialogRef = this.dialog.open(CommonDialogConfirmationComponent,
      {
        data: id
    //   width: 'auto',
    //   height: 'auto',
    //   maxHeight: 'auto',
    //   panelClass: 'border-style',
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    // this.postService.deletePost(id);
  }
}
