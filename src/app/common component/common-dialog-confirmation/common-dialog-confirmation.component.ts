import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {PostService} from '../../posts/post.service';

@Component({
  selector: 'app-common-dialog-confirmation',
  templateUrl: './common-dialog-confirmation.component.html',
  styleUrls: ['./common-dialog-confirmation.component.css']
})
export class CommonDialogConfirmationComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public id: any,
              public postService: PostService) { }

  ngOnInit() {
  }

  onCancel() {
    console.log('PstId', this.id);
  }

  onDelete() {
    this.postService.deletePost(this.id);
  }

}
