/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function () {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/reviews',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_read_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'create': function (id, workshop_id, text) {
            let ajax_options = {
                type: 'POST',
                url: 'api/reviews',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'id': parseInt(id),
                    'workshop_id': parseInt(workshop_id),
                    'text': text
                })
            };
            console.log(ajax_options.data)
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_create_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'update': function (id, workshop_id, text) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/reviews/' + id,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'workshop_id': parseInt(workshop_id),
                    'text': text
                })
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_update_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'delete': function (id) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/reviews/' + id,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_delete_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        }
    };
}());

// Create the view instance
ns.view = (function () {
    'use strict';

    let $id = $('#id'),
        $workshop = $('#workshop'),
        $comments = $('#comments');

    // return the API
    return {
        reset: function () {
            $id.val('');
            $text.val('');
            $workshop_id.val('').focus();
        },
        update_editor: function (id, workshop_id, text) {
            $id.val(id)
            $text.val(text).focus();
            $workshop_id.val(workshop_id);
        },
        build_table: function (reviews) {
            let rows = ''

            // clear the table
            $('.reviews table > tbody').empty();

            // did we get a reviews array?
            if (reviews) {
                for (let i = 0, l = reviews.length; i < l; i++) {
                    rows += `<tr><td class="id">${reviews[i].id}</td>
                    <td class="workshop_id">${reviews[i].workshop}</td>
                    <td class="difficulty">${reviews[i].difficulty}</td>
                    <td class="assistants_score">${reviews[i].assistants_score}</td>
                    <td class="knowledge">${reviews[i].knowledge}</td>
                    <td class="objectives">${reviews[i].objectives}</td>
                    <td class="timeliness">${reviews[i].timeliness}</td>
                    <td class="venue_score">${reviews[i].venue_score}</td>
                    <td class="satisfaction_score">${reviews[i].satisfaction_score}</td>
                    <td class="comments">${reviews[i].comments}</td>
                    </tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function (error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function () {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $id = $('#id'),
        $workshop_id = $('#workshop_id'),
        $text = $('#text');
    // Get the data from the model after the controller is done initializing
    setTimeout(function () {
        model.read();
    }, 100)

    // Validate input
    function validate(workshop_id, text) {
        return workshop_id !== "" && text !== "";
    }

    // Create our event handlers
    $('#create').click(function (e) {

        let id = $id.val(),
            workshop_id = $workshop_id.val(),
            text = $text.val();
        e.preventDefault();

        if (validate(workshop_id, text)) {
            model.create(id, workshop_id, text)
        } else {
            alert('Problem with one or more input');
        }
    });

    $('#update').click(function (e) {
        let id = $id.val(),
            workshop_id = $workshop_id.val(),
            text = $text.val();

        e.preventDefault();

        if (validate(workshop_id, text)) {
            model.update(id, workshop_id, text)
        } else {
            alert('Problem with fone or more input');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let id = $id.val();
        e.preventDefault();
        model.delete(id)

        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    })

    $('table > tbody').on('click', 'tr', function (e) {
        let $target = $(e.target),
            id,
            workshop_id,
            text;

        id = $target
            .parent()
            .find('td.id')
            .text();

        workshop_id = $target
            .parent()
            .find('td.workshop_id')
            .text();

        text = $target
            .parent()
            .find('td.text')
            .text();

        view.update_editor(id, workshop_id, text);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function (e, data) {
        model.read();
        console.log('model create success callback')
    });

    $event_pump.on('model_update_success', function (e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function (e, data) {
        model.read();
        console.log('model delete success callback')
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));

