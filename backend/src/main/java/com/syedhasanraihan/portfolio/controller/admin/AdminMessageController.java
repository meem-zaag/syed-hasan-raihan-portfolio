package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.message.ContactMessageResponse;
import com.syedhasanraihan.portfolio.service.MessageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/messages")
@Tag(name = "Admin - Messages")
@SecurityRequirement(name = "bearerAuth")
public class AdminMessageController {

    private final MessageService messageService;

    public AdminMessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public PageResult<ContactMessageResponse> list(@RequestParam(required = false, defaultValue = "false") boolean unreadOnly,
                                                     Pageable pageable) {
        return messageService.list(unreadOnly, pageable);
    }

    @PatchMapping("/{id}/read")
    public ContactMessageResponse markRead(@PathVariable Long id) {
        return messageService.markRead(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        messageService.delete(id);
    }
}
