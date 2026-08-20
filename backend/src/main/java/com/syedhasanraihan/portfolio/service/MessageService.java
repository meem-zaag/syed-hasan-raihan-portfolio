package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.message.ContactMessageRequest;
import com.syedhasanraihan.portfolio.dto.message.ContactMessageResponse;
import com.syedhasanraihan.portfolio.entity.ContactMessage;
import com.syedhasanraihan.portfolio.repository.ContactMessageRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {

    private final ContactMessageRepository contactMessageRepository;

    public MessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Transactional
    public ContactMessageResponse submit(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name());
        message.setEmail(request.email());
        message.setSubject(request.subject());
        message.setMessage(request.message());
        return ContactMessageResponse.from(contactMessageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public PageResult<ContactMessageResponse> list(boolean unreadOnly, Pageable pageable) {
        var page = unreadOnly
                ? contactMessageRepository.findByReadFalseOrderByCreatedAtDesc(pageable)
                : contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResult.from(page, ContactMessageResponse::from);
    }

    @Transactional
    public ContactMessageResponse markRead(Long id) {
        ContactMessage message = findEntity(id);
        message.setRead(true);
        return ContactMessageResponse.from(contactMessageRepository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        contactMessageRepository.delete(findEntity(id));
    }

    private ContactMessage findEntity(Long id) {
        return contactMessageRepository.findById(id).orElseThrow(() -> NotFoundException.of("ContactMessage", id));
    }
}
