import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService){

    }

    @Get()
    getBookmarks(@GetUser('id') userId: number){
        return this.bookmarkService.getBookmarks(userId);
    }
    
    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number){

    }

    @Post()
    createBookmark(@GetUser('id') userId: number){}

    @Patch()
    editBookmarkById(@GetUser('id') userId: number){}

    @Delete()
    deleteBookmarkById(@GetUser('id') userId: number){}

}
