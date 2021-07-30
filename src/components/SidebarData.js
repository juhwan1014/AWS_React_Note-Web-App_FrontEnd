import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome size={35} />,
        cName: 'nav-text'
    },
    {
        title: 'Link',
        path: '/link',
        icon: <IoIcons.IoIosLink size={35} />,
        cName: 'nav-text'
    },
    {
        title: 'Images',
        path: '/gallery',
        icon: <IoIcons.IoMdImages size={35} />,
        cName: 'nav-text'
    },
    {
        title: 'Notes',
        path: '/notes',
        icon: <MdIcons.MdSpeakerNotes size={35} />,
        cName: 'nav-text'
    },
    {
        title: 'TodoList',
        path: '/todo',
        icon: <RiIcons.RiTodoLine size={35} />,
        cName: 'nav-text'
    },
    {
        title: 'My Profile',
        path: '/profile',
        icon: <IoIcons.IoMdHelpCircle size={35} />,
        cName: 'nav-text'
    }
];