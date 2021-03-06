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
        'create': function (id, workshop_id, assistants, difficulty,
            knowledge, objectives, satisfaction, timeliness, venue, comments) {
            let ajax_options = {
                type: 'POST',
                url: 'api/reviews',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'id': parseInt(id),
                    'workshop_id': parseInt(workshop_id),
                    'assistants_score': parseInt(assistants),
                    'difficulty': parseInt(difficulty),
                    'knowledge': parseInt(knowledge),
                    'objectives': parseInt(objectives),
                    'satisfaction_score': parseInt(satisfaction),
                    'timeliness': parseInt(timeliness),
                    'venue_score': parseInt(venue),
                    'comments': comments
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
        'update': function (id, workshop_id, assistants, difficulty,
            knowledge, objectives, satisfaction, timeliness, venue, comments) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/reviews/' + id,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'id': parseInt(id),
                    'workshop_id': parseInt(workshop_id),
                    'assistants_score': parseInt(assistants),
                    'difficulty': parseInt(difficulty),
                    'knowledge': parseInt(knowledge),
                    'objectives': parseInt(objectives),
                    'satisfaction_score': parseInt(satisfaction),
                    'timeliness': parseInt(timeliness),
                    'venue_score': parseInt(venue),
                    'comments': comments
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

    let $id = $('#review_id'),
        $workshop_id = $('#workshop_id'),
        $assistants = $('#assistants'),
        $difficulty = $('#difficulty'),
        $knowledge = $('#knowledge'),
        $objectives = $('#objectives'),
        $satisfaction = $('#satisfaction'),
        $timeliness = $('#timeliness'),
        $venue = $('#venue'),
        $comments = $('#comments');

    // return the API
    return {
        reset: function () {
            $id.val('');
            $assistants.val('');
            $difficulty.val('');
            $knowledge.val('');
            $objectives.val('');
            $satisfaction.val('');
            $timeliness.val('');
            $venue.val('');
            $workshop_id.val('').focus();
            $comments.val('');
        },

        update_editor: function (id, workshop_id, difficulty, assistants_score,
            knowledge, objectives, timeliness, venue_score, satisfaction_score, comments) {
            $id.val(id);
            $workshop_id.val(workshop_id);
            $difficulty.val(difficulty);
            $assistants.val(assistants_score);
            $knowledge.val(knowledge);
            $objectives.val(objectives);
            $timeliness.val(timeliness);
            $venue.val(venue_score);
            $satisfaction.val(satisfaction_score);
            $comments.val(comments).focus();
        },
        build_table: function (reviews) {
            let rows = ''

            // clear the table
            $('.reviews table > tbody').empty();

            // did we get a reviews array?
            if (reviews) {
                for (let i = 0, l = reviews.length; i < l; i++) {
                    rows += `<tr><td class="id" data-label="id">${reviews[i].id}</td>
                    <td class="workshop_id" data-label="workshop_id">${reviews[i].workshop_id}</td>
                    <td class="difficulty" data-label="difficulty">${reviews[i].difficulty}</td>
                    <td class="assistants_score" data-label="assistants_score">${reviews[i].assistants_score}</td>
                    <td class="knowledge" data-label="knowledge">${reviews[i].knowledge}</td>
                    <td class="objectives" data-label="objectives">${reviews[i].objectives}</td>
                    <td class="timeliness" data-label="timeliness">${reviews[i].timeliness}</td>
                    <td class="venue_score" data-label="venue_score">${reviews[i].venue_score}</td>
                    <td class="satisfaction_score" data-label="satisfaction_score">${reviews[i].satisfaction_score}</td>
                    <td class="comments" data-label="comments">${reviews[i].comments}</td>
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
        $id = $('#review_id'),
        $workshop_id = $('#workshop_id'),
        $assistants = $('#assistants'),
        $difficulty = $('#difficulty'),
        $knowledge = $('#knowledge'),
        $objectives = $('#objectives'),
        $satisfaction = $('#satisfaction'),
        $timeliness = $('#timeliness'),
        $venue = $('#venue'),
        $comments = $('#comments');
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
            assistants = $assistants.val(),
            difficulty = $difficulty.val(),
            knowledge = $knowledge.val(),
            objectives = $objectives.val(),
            satisfaction = $satisfaction.val(),
            timeliness = $timeliness.val(),
            venue = $venue.val(),
            comments = $comments.val();
        e.preventDefault();

        if (validate(id, workshop_id, assistants, difficulty,
            knowledge, objectives, satisfaction, timeliness, venue, comments)) {
            model.create(id, workshop_id, assistants, difficulty, knowledge,
                objectives, satisfaction, timeliness, venue, comments)
        } else {
            alert('Problem with one or more input');
        }
    });

    $('#update').click(function (e) {
        let id = $id.val(),
            workshop_id = $workshop_id.val(),
            assistants = $assistants.val(),
            difficulty = $difficulty.val(),
            knowledge = $knowledge.val(),
            objectives = $objectives.val(),
            satisfaction = $satisfaction.val(),
            timeliness = $timeliness.val(),
            venue = $venue.val(),
            comments = $comments.val();

        e.preventDefault();

        if (validate(id, workshop_id, assistants, difficulty,
            knowledge, objectives, satisfaction, timeliness, venue, comments)) {
            model.update(id, workshop_id, assistants, difficulty, knowledge,
                objectives, satisfaction, timeliness, venue, comments)
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
            difficulty,
            assistants_score,
            knowledge,
            objectives,
            timeliness,
            venue_score,
            satisfaction_score,
            comments;

        id = $target.parent().find('td.id').text();
        workshop_id = $target.parent().find('td.workshop_id').text();
        difficulty = $target.parent().find('td.difficulty').text()
        assistants_score = $target.parent().find('td.assistants_score').text()
        knowledge = $target.parent().find('td.knowledge').text()
        objectives = $target.parent().find('td.objectives').text()
        timeliness = $target.parent().find('td.timeliness').text()
        venue_score = $target.parent().find('td.venue_score').text()
        satisfaction_score = $target.parent().find('td.satisfaction_score').text()
        comments = $target.parent().find('td.comments').text();

        view.update_editor(id, workshop_id, difficulty, assistants_score,
            knowledge, objectives, timeliness, venue_score, satisfaction_score, comments);
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

