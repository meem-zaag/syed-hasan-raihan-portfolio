package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.message.ContactMessageRequest;
import com.syedhasanraihan.portfolio.dto.message.ContactMessageResponse;
import com.syedhasanraihan.portfolio.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
@Tag(name = "Public - Contact")
public class PublicContactController {

    private final MessageService messageService;

    public PublicContactController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessageResponse submit(@Valid @RequestBody ContactMessageRequest request) {
        return messageService.submit(request);
    }
}
