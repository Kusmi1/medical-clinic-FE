import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should add message ', () => {
    //given
    const message = 'create';
    //when
    service.add(message);
    //create
    expect(service.messages).toContain(message);
  });
  it('should  clear messages', () => {
    //given
    const messages = 'create';
    service.add(messages);
    //when
    service.clear();
    // create
    expect(service.messages).toEqual([]);
  });

  it('should create empty array with messages', () => {
    expect(service.messages).toEqual([]);
  });
});
