import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";

import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { jwtDecode } from "jwt-decode";
import { BookService } from "../../../Services/book.service";
import { CommonModule } from "@angular/common";
import { PaginationComponent } from "../../pagination/pagination.component";;
import { Router } from "@angular/router";
import { Token } from "@angular/compiler";


@Component({
    selector: "app-home",
    standalone: true,
    imports: [HttpClientModule, NavBarComponent,CommonModule, PaginationComponent ],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css"
})
export class HomeComponent {
  books: any[] = [];
  userID: any;
  itemsPerPage: number = 4; // Number of items to display per page
  currentPage: number = 1; // Current page
  totalPages: number[] = []; // Array to store total page numbers
  displayedBooks: any[] = []; // Array to store books to display on the current page
  booksToShow: any[] = [];
  selectedStatus: string = "all";
  constructor(private _BookService: BookService , private _Router:Router , private httpclient:HttpClient) {}

  ngOnInit(): void {
    const token: any = localStorage.getItem("userToken");
    const decode: any = jwtDecode(token); // Correct usage
    this.userID = decode.user_id;
    this.selectBooks(this.userID, "all");

}

selectBooks(userId: string, status: string = "all"): void {
  this._BookService.getUserBooksByStatus(userId, status).subscribe((data: any) => {
    this.books = data;
    this.updateDisplayedBooks();
  });
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.updateDisplayedBooks();
}

updateDisplayedBooks(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedBooks = this.books.slice(startIndex, endIndex);
}

redirectToBook(bookId: string): void {
  this._Router.navigate(["/books", bookId]);
}

redirectToAuthor(authorId: number): void {
  this._Router.navigate(["/authors", authorId]);
}
}